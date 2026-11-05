import CloudKit
import Foundation

// Only authenticated ciphertext belongs here. Wallet names, addresses and
// recovery material are never CloudKit fields or record names.
final class BitholdBackupCloud {
  enum Failure: Error { case accountUnavailable, accountChanged, invalidRecord }
  let container = CKContainer(identifier: "iCloud.app.bithold.wallet")
  private let zoneID = CKRecordZone.ID(zoneName: "EncryptedBackupsV1", ownerName: CKCurrentUserDefaultName)
  private var database: CKDatabase { container.privateCloudDatabase }

  func account() async throws -> CKRecord.ID {
    guard try await container.accountStatus() == .available else { throw Failure.accountUnavailable }
    return try await container.userRecordID()
  }

  func verifyAccount(_ expected: CKRecord.ID) async throws {
    guard try await account() == expected else { throw Failure.accountChanged }
  }

  func save(_ ciphertext: Data, id: String, account: CKRecord.ID) async throws {
    guard UUID(uuidString: id) != nil, !ciphertext.isEmpty,
          ciphertext.count <= BitholdBackupCrypto.maximumEnvelopeBytes else { throw Failure.invalidRecord }
    try await verifyAccount(account)
    _ = try await database.save(CKRecordZone(zoneID: zoneID))
    let directory = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
    try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: false,
      attributes: [.protectionKey: FileProtectionType.complete, .posixPermissions: 0o700])
    defer { try? FileManager.default.removeItem(at: directory) }
    var excluded = directory
    var values = URLResourceValues()
    values.isExcludedFromBackup = true
    try excluded.setResourceValues(values)
    let file = directory.appendingPathComponent("encrypted-backup")
    try ciphertext.write(to: file, options: [.atomic, .completeFileProtection])
    let record = CKRecord(recordType: "EncryptedWalletBackup", recordID: CKRecord.ID(recordName: id, zoneID: zoneID))
    record["payload"] = CKAsset(fileURL: file)
    record["format"] = 1 as CKRecordValue
    try await verifyAccount(account)
    // Every save gets a new UUID. Existing backups are never overwritten.
    let result = try await database.modifyRecords(saving: [record], deleting: [],
      savePolicy: .ifServerRecordUnchanged, atomically: true)
    guard let saved = result.saveResults[record.recordID] else { throw Failure.invalidRecord }
    _ = try saved.get()
    try await verifyAccount(account)
  }

  func load(id: String, account: CKRecord.ID) async throws -> Data {
    guard UUID(uuidString: id) != nil else { throw Failure.invalidRecord }
    try await verifyAccount(account)
    let record = try await database.record(for: CKRecord.ID(recordName: id, zoneID: zoneID))
    guard record.recordType == "EncryptedWalletBackup",
          record["format"] as? Int == 1,
          let asset = record["payload"] as? CKAsset, let file = asset.fileURL else { throw Failure.invalidRecord }
    let size = try file.resourceValues(forKeys: [.fileSizeKey]).fileSize ?? 0
    guard size > 0, size <= BitholdBackupCrypto.maximumEnvelopeBytes else { throw Failure.invalidRecord }
    let data = try Data(contentsOf: file)
    guard data.count <= BitholdBackupCrypto.maximumEnvelopeBytes else { throw Failure.invalidRecord }
    try await verifyAccount(account)
    return data
  }

  struct Entry { let id: String; let created: Date }

  // Zone changes avoid a public/query database and do not require a searchable
  // wallet identifier. A fresh enumeration also works after reinstalling.
  func list(account: CKRecord.ID) async throws -> [Entry] {
    try await verifyAccount(account)
    var token: CKServerChangeToken?
    var entries: [String: Entry] = [:]
    repeat {
      let page: Page
      do { page = try await changes(after: token) }
      catch let error as CKError where error.code == .zoneNotFound {
        try await verifyAccount(account)
        return []
      }
      for id in page.deleted { entries.removeValue(forKey: id) }
      for entry in page.entries { entries[entry.id] = entry }
      guard !page.more || page.token != nil else { throw Failure.invalidRecord }
      token = page.token
      if !page.more { break }
    } while true
    try await verifyAccount(account)
    return entries.values.sorted { $0.created > $1.created }
  }

  private struct Page {
    var entries: [Entry] = []
    var deleted: [String] = []
    var token: CKServerChangeToken?
    var more = false
    var error: Error?
  }

  private func changes(after token: CKServerChangeToken?) async throws -> Page {
    try await withCheckedThrowingContinuation { continuation in
      let config = CKFetchRecordZoneChangesOperation.ZoneConfiguration()
      config.previousServerChangeToken = token
      config.desiredKeys = []
      config.resultsLimit = 100
      let op = CKFetchRecordZoneChangesOperation(recordZoneIDs: [zoneID], configurationsByRecordZoneID: [zoneID: config])
      op.fetchAllChanges = false
      let lock = NSLock()
      var page = Page()
      op.recordWasChangedBlock = { _, result in
        lock.lock(); defer { lock.unlock() }
        switch result {
        case .success(let record):
          if record.recordType == "EncryptedWalletBackup", UUID(uuidString: record.recordID.recordName) != nil {
            page.entries.append(Entry(id: record.recordID.recordName, created: record.creationDate ?? .distantPast))
          }
        case .failure(let error): page.error = error
        }
      }
      op.recordWithIDWasDeletedBlock = { id, _ in
        lock.lock(); defer { lock.unlock() }
        page.deleted.append(id.recordName)
      }
      op.recordZoneFetchResultBlock = { _, result in
        lock.lock(); defer { lock.unlock() }
        switch result {
        case .success(let value): page.token = value.serverChangeToken; page.more = value.moreComing
        case .failure(let error): page.error = error
        }
      }
      op.fetchRecordZoneChangesResultBlock = { result in
        lock.lock(); let value = page; lock.unlock()
        if let error = value.error { continuation.resume(throwing: error); return }
        switch result {
        case .success: continuation.resume(returning: value)
        case .failure(let error): continuation.resume(throwing: error)
        }
      }
      database.add(op)
    }
  }
}

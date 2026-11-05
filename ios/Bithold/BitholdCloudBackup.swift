import AuthenticationServices
import CloudKit
import CryptoKit
import React
import UIKit

@objc(BitholdCloudBackup)
final class BitholdCloudBackup: NSObject {
  @MainActor private var busy = false
  @objc static func requiresMainQueueSetup() -> Bool { false }
  private enum Failure: Error {
    case unavailable, invalidPayload, verificationFailed, preparationBusy, preparationUnavailable
  }
  private enum Stage: String {
    case configuration, account, payload, presentation, registration, assertion
    case encryption, upload, download, verification, listing, restoration
  }
  @MainActor private final class Progress {
    var stage: Stage = .account
  }
  // A preparation belongs to one token and iCloud account, and is consumed once.
  private struct Prepared {
    let id: String, credential: Data, salt: Data, key: SymmetricKey, made: Date
    let account: CKRecord.ID
  }
  @MainActor private var prepared: Prepared?
  @MainActor private var preparedExpiry: Task<Void, Never>?
  private static let preparationLifetime: TimeInterval = 300

  @MainActor private func clearPrepared() {
    prepared = nil
    preparedExpiry?.cancel()
    preparedExpiry = nil
  }

  private static func isFresh(_ value: Prepared) -> Bool {
    let age = Date().timeIntervalSince(value.made)
    return age >= 0 && age < preparationLifetime
  }

  @MainActor private func schedulePreparedExpiry(token: String) {
    preparedExpiry?.cancel()
    preparedExpiry = Task { @MainActor [weak self] in
      do { try await Task.sleep(nanoseconds: 300_000_000_000) }
      catch { return }
      guard !Task.isCancelled, let self, self.prepared?.id == token else { return }
      self.clearPrepared()
    }
  }

  @objc(save:resolver:rejecter:)
  func save(_ payload: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    perform(resolve, reject) { cloud, account, appID, progress in
      progress.stage = .payload
      guard #available(iOS 18.0, *) else { throw Failure.unavailable }
      guard let data = payload.data(using: .utf8), !data.isEmpty,
            data.count <= BitholdBackupCrypto.maximumPlaintextBytes else { throw Failure.invalidPayload }
      let id = UUID().uuidString
      progress.stage = .presentation
      let passkey = try Self.passkey()
      let salt = try BitholdBackupPasskey.randomData()
      progress.stage = .registration
      let registration = try await passkey.register(name: "Bithold backup \(id.prefix(8))",
        userID: BitholdBackupPasskey.randomData(), salt: salt)
      let credential = registration.credentialID
      let key: SymmetricKey
      if let registrationKey = registration.key {
        key = registrationKey
      } else {
        progress.stage = .assertion
        key = try await passkey.key(credentialID: credential, salt: salt)
      }
      progress.stage = .encryption
      let context = BitholdBackupCrypto.Context(version: 1, relyingParty: "bithold.app", applicationID: appID,
        backupID: id, credentialID: credential, prfSalt: salt)
      let ciphertext = try BitholdBackupCrypto.seal(data, using: key, context: context)
      progress.stage = .upload
      try await cloud.save(ciphertext, id: id, account: account)
      progress.stage = .download
      let downloaded = try await cloud.load(id: id, account: account)
      progress.stage = .verification
      let opened = try BitholdBackupCrypto.open(downloaded, using: key, applicationID: appID,
        backupID: id, authenticatedCredentialID: credential)
      guard opened == data else { throw Failure.verificationFailed }
      return ["id": id, "verified": true] as [String: Any]
    }
  }

  // Obtain a PRF key at registration, requesting an assertion only when
  // the credential provider does not return the registration output.
  @objc(prepare:rejecter:)
  func prepare(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    perform(resolve, reject) { cloud, account, _, progress in
      guard #available(iOS 18.0, *) else { throw Failure.unavailable }
      progress.stage = .payload
      if let previous = self.prepared, !Self.isFresh(previous) { self.clearPrepared() }
      guard self.prepared == nil else { throw Failure.preparationBusy }
      let id = UUID().uuidString
      progress.stage = .presentation
      let passkey = try Self.passkey()
      let salt = try BitholdBackupPasskey.randomData()
      progress.stage = .registration
      let registration = try await passkey.register(name: "Bithold backup \(id.prefix(8))",
        userID: BitholdBackupPasskey.randomData(), salt: salt)
      let credential = registration.credentialID
      let key: SymmetricKey
      if let registrationKey = registration.key {
        key = registrationKey
      } else {
        progress.stage = .assertion
        key = try await passkey.key(credentialID: credential, salt: salt)
      }
      progress.stage = .account
      try await cloud.verifyAccount(account)
      self.prepared = Prepared(id: id, credential: credential, salt: salt, key: key, made: Date(), account: account)
      self.schedulePreparedExpiry(token: id)
      return id
    }
  }

  // Step 2: seal the payload with the prepared key, upload it, read it back
  // and open it, as `save` does. The key is used once.
  @objc(upload:token:resolver:rejecter:)
  func upload(_ payload: String, token: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    perform(resolve, reject) { cloud, account, appID, progress in
      progress.stage = .payload
      guard #available(iOS 18.0, *) else { throw Failure.unavailable }
      guard let prepared = self.prepared, prepared.id == token else {
        throw Failure.preparationUnavailable
      }
      self.clearPrepared()
      guard Self.isFresh(prepared) else { throw Failure.preparationUnavailable }
      progress.stage = .account
      guard prepared.account == account else { throw BitholdBackupCloud.Failure.accountChanged }
      progress.stage = .payload
      guard let data = payload.data(using: .utf8), !data.isEmpty,
            data.count <= BitholdBackupCrypto.maximumPlaintextBytes else { throw Failure.invalidPayload }
      progress.stage = .encryption
      let context = BitholdBackupCrypto.Context(version: 1, relyingParty: "bithold.app", applicationID: appID,
        backupID: prepared.id, credentialID: prepared.credential, prfSalt: prepared.salt)
      let ciphertext = try BitholdBackupCrypto.seal(data, using: prepared.key, context: context)
      progress.stage = .upload
      try await cloud.save(ciphertext, id: prepared.id, account: account)
      progress.stage = .download
      let downloaded = try await cloud.load(id: prepared.id, account: account)
      progress.stage = .verification
      let opened = try BitholdBackupCrypto.open(downloaded, using: prepared.key, applicationID: appID,
        backupID: prepared.id, authenticatedCredentialID: prepared.credential)
      guard opened == data else { throw Failure.verificationFailed }
      return ["id": prepared.id, "verified": true] as [String: Any]
    }
  }

  @objc(discardPrepared:resolver:rejecter:)
  func discardPrepared(_ token: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      guard prepared?.id == token else { resolve(false); return }
      clearPrepared()
      resolve(true)
    }
  }

  @objc(list:rejecter:)
  func list(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    perform(resolve, reject) { cloud, account, _, progress in
      progress.stage = .listing
      return try await cloud.list(account: account).map { ["id": $0.id, "created": $0.created.timeIntervalSince1970 * 1000] as [String: Any] }
    }
  }

  @objc(restore:resolver:rejecter:)
  func restore(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    perform(resolve, reject) { cloud, account, appID, progress in
      guard #available(iOS 18.0, *) else { throw Failure.unavailable }
      progress.stage = .download
      let ciphertext = try await cloud.load(id: id, account: account)
      progress.stage = .restoration
      let context = try BitholdBackupCrypto.context(in: ciphertext, applicationID: appID, backupID: id)
      progress.stage = .presentation
      let passkey = try Self.passkey()
      progress.stage = .assertion
      let key = try await passkey.key(credentialID: context.credentialID, salt: context.prfSalt)
      progress.stage = .account
      try await cloud.verifyAccount(account)
      progress.stage = .restoration
      let plaintext = try BitholdBackupCrypto.open(ciphertext, using: key, applicationID: appID,
        backupID: id, authenticatedCredentialID: context.credentialID)
      guard let payload = String(data: plaintext, encoding: .utf8) else { throw Failure.invalidPayload }
      return payload
    }
  }

  private func perform(_ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock,
    operation: @escaping @MainActor (BitholdBackupCloud, CKRecord.ID, String, Progress) async throws -> Any) {
    Task { @MainActor in
      guard #available(iOS 18.0, *) else { reject("cloud.unsupported", "BHCB:configuration:app:4", nil); return }
      guard !busy else { reject("cloud.busy", "BHCB:configuration:app:5", nil); return }
      guard Bundle.main.bundleIdentifier == "bithold-bitcoin.bithold" else {
        reject("cloud.configuration", "BHCB:configuration:app:6", nil); return
      }
      busy = true
      defer { busy = false }
      let progress = Progress()
      do {
        let cloud = BitholdBackupCloud()
        let account = try await cloud.account()
        resolve(try await operation(cloud, account, "app.bithold.wallet", progress))
      } catch {
        // Do not forward raw CloudKit/credential errors or wallet payloads to JS logs.
        var code = "cloud.failed"
        if let error = error as? Failure {
          switch error {
          case .preparationBusy: code = "cloud.busy"
          case .preparationUnavailable: code = "cloud.interrupted"
          default: break
          }
        }
        if let error = error as? ASAuthorizationError, error.code == .canceled { code = "cloud.cancelled" }
        if let error = error as? BitholdBackupPasskey.Failure, case .unsupportedPRF = error { code = "cloud.prfUnsupported" }
        if let error = error as? BitholdBackupCloud.Failure {
          switch error {
          case .accountUnavailable: code = "cloud.accountUnavailable"
          case .accountChanged: code = "cloud.accountChanged"
          default: break
          }
        }
        if let error = error as? CKError {
          switch error.code {
          case .notAuthenticated: code = "cloud.accountUnavailable"
          case .quotaExceeded: code = "cloud.quotaExceeded"
          case .networkUnavailable, .networkFailure, .serviceUnavailable, .requestRateLimited: code = "cloud.network"
          default: break
          }
        }
        let reference = Self.reference(for: error, stage: progress.stage)
        Self.recordDiagnostic(reference)
        reject(code, reference, nil)
      }
    }
  }

  private static func recordDiagnostic(_ reference: String) {
    guard let directory = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first,
          let data = try? JSONSerialization.data(withJSONObject: [
            "reference": reference,
            "recordedAt": ISO8601DateFormatter().string(from: Date())
          ]) else { return }
    try? data.write(to: directory.appendingPathComponent("cloud-backup-diagnostic.json"),
                    options: [.atomic, .completeFileProtection])
  }

  @available(iOS 18.0, *)
  private static func reference(for error: Error, stage: Stage) -> String {
    let category: String
    let number: Int
    switch error {
    case let error as ASAuthorizationError:
      category = "authorization"
      number = error.code.rawValue
    case let error as CKError:
      category = "cloudkit"
      number = error.code.rawValue
    case let error as BitholdBackupPasskey.Failure:
      category = "passkey"
      switch error {
      case .busy: number = 1
      case .invalidInput: number = 2
      case .unavailable: number = 3
      case .unsupportedPRF: number = 4
      case .unexpectedCredential: number = 5
      case .randomFailure: number = 6
      }
    case let error as BitholdBackupCloud.Failure:
      category = "storage"
      switch error {
      case .accountUnavailable: number = 1
      case .accountChanged: number = 2
      case .invalidRecord: number = 3
      }
    case let error as BitholdBackupCrypto.Failure:
      category = "crypto"
      switch error {
      case .invalidEnvelope: number = 1
      case .unsupportedVersion: number = 2
      case .wrongContext: number = 3
      case .invalidKey: number = 4
      case .invalidPayload: number = 5
      }
    case let error as CryptoKitError:
      category = "cryptokit"
      switch error {
      case .incorrectKeySize: number = 1
      case .incorrectParameterSize: number = 2
      case .authenticationFailure: number = 3
      case .underlyingCoreCryptoError: number = 4
      case .wrapFailure: number = 5
      case .unwrapFailure: number = 6
      case .invalidParameter: number = 7
      @unknown default: number = 0
      }
    case let error as Failure:
      category = "app"
      switch error {
      case .unavailable: number = 1
      case .invalidPayload: number = 2
      case .verificationFailed: number = 3
      case .preparationBusy: number = 7
      case .preparationUnavailable: number = 8
      }
    default:
      category = "unknown"
      number = 0
    }
    let safeNumber = (0...999_999).contains(number) ? number : 0
    return "BHCB:\(stage.rawValue):\(category):\(safeNumber)"
  }

  @available(iOS 18.0, *)
  @MainActor private static func passkey() throws -> BitholdBackupPasskey {
    guard UIApplication.shared.applicationState == .active,
          let window = UIApplication.shared.connectedScenes.compactMap({ $0 as? UIWindowScene })
            .filter({ $0.activationState == .foregroundActive }).flatMap({ $0.windows }).first(where: { $0.isKeyWindow })
    else { throw Failure.unavailable }
    return BitholdBackupPasskey(anchor: window)
  }
}

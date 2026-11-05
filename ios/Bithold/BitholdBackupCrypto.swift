import Foundation
import CryptoKit

// The PRF output comes from AuthenticationServices, never from a passcode,
// credential ID or a WebAuthn signature. This layer has no storage/network I/O.
enum BitholdBackupCrypto {
  static let maximumPlaintextBytes = 1_048_576
  static let maximumEnvelopeBytes = 1_500_000

  enum Failure: Error {
    case invalidEnvelope, unsupportedVersion, wrongContext, invalidKey, invalidPayload
  }

  struct Context: Codable, Equatable {
    let version: Int
    let relyingParty: String
    let applicationID: String
    let backupID: String
    let credentialID: Data
    let prfSalt: Data
  }

  private struct Envelope: Codable {
    let context: Context
    let sealed: Data
  }

  private static func encoder() -> JSONEncoder {
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.sortedKeys, .withoutEscapingSlashes]
    return encoder
  }

  private static func validate(_ context: Context) throws {
    guard context.version == 1 else { throw Failure.unsupportedVersion }
    guard context.relyingParty == "bithold.app",
          !context.applicationID.isEmpty, context.applicationID.utf8.count <= 256,
          UUID(uuidString: context.backupID) != nil,
          (1...1024).contains(context.credentialID.count),
          context.prfSalt.count == 32 else { throw Failure.invalidEnvelope }
  }

  private static func encryptionKey(prf: SymmetricKey, context: Context) throws -> SymmetricKey {
    guard prf.bitCount == 256 else { throw Failure.invalidKey }
    // Separate the backup encryption key from other future uses of this PRF.
    return HKDF<SHA256>.deriveKey(
      inputKeyMaterial: prf,
      salt: context.prfSalt,
      info: Data("bithold.app/wallet-backup/aes-gcm/v1".utf8),
      outputByteCount: 32
    )
  }

  static func seal(_ plaintext: Data, using prf: SymmetricKey, context: Context) throws -> Data {
    try validate(context)
    guard !plaintext.isEmpty, plaintext.count <= maximumPlaintextBytes else {
      throw Failure.invalidPayload
    }
    let authenticatedContext = try encoder().encode(context)
    // CryptoKit generates a fresh random nonce for every save.
    let box = try AES.GCM.seal(
      plaintext,
      using: encryptionKey(prf: prf, context: context),
      authenticating: authenticatedContext
    )
    guard let combined = box.combined else { throw Failure.invalidEnvelope }
    let encoded = try encoder().encode(Envelope(context: context, sealed: combined))
    guard encoded.count <= maximumEnvelopeBytes else { throw Failure.invalidEnvelope }
    return encoded
  }

  // This metadata is untrusted until open() verifies the GCM tag. It is only
  // used to select a credential and supply its PRF salt to AuthenticationServices.
  static func context(in data: Data, applicationID: String, backupID: String) throws -> Context {
    let envelope = try decode(data)
    guard envelope.context.applicationID == applicationID,
          envelope.context.backupID == backupID else { throw Failure.wrongContext }
    return envelope.context
  }

  static func open(
    _ data: Data,
    using prf: SymmetricKey,
    applicationID: String,
    backupID: String,
    authenticatedCredentialID: Data
  ) throws -> Data {
    let envelope = try decode(data)
    let context = envelope.context
    guard context.applicationID == applicationID,
          context.backupID == backupID,
          context.credentialID == authenticatedCredentialID else { throw Failure.wrongContext }
    let plaintext = try AES.GCM.open(
      AES.GCM.SealedBox(combined: envelope.sealed),
      using: encryptionKey(prf: prf, context: context),
      authenticating: encoder().encode(context)
    )
    guard !plaintext.isEmpty, plaintext.count <= maximumPlaintextBytes else {
      throw Failure.invalidPayload
    }
    return plaintext
  }

  private static func decode(_ data: Data) throws -> Envelope {
    guard !data.isEmpty, data.count <= maximumEnvelopeBytes else { throw Failure.invalidEnvelope }
    let envelope = try JSONDecoder().decode(Envelope.self, from: data)
    try validate(envelope.context)
    guard envelope.sealed.count >= 29,
          envelope.sealed.count <= maximumPlaintextBytes + 28 else { throw Failure.invalidEnvelope }
    return envelope
  }
}

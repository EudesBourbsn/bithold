import AuthenticationServices
import CryptoKit
import Security
import UIKit

// Native PRF adapter for encrypted backups. This does not upload data, expose
// PRF keys to JavaScript, or treat a Face ID prompt alone as a passkey.
@available(iOS 18.0, *)
@MainActor
final class BitholdBackupPasskey: NSObject, ASAuthorizationControllerDelegate,
  ASAuthorizationControllerPresentationContextProviding {
  enum Failure: Error {
    case busy, invalidInput, unavailable, unsupportedPRF, unexpectedCredential, randomFailure
  }

  private let anchor: ASPresentationAnchor
  private let provider = ASAuthorizationPlatformPublicKeyCredentialProvider(relyingPartyIdentifier: "bithold.app")
  private var continuation: CheckedContinuation<ASAuthorizationCredential, Error>?
  private var controller: ASAuthorizationController?

  init(anchor: ASPresentationAnchor) {
    self.anchor = anchor
    super.init()
  }

  static func randomData(count: Int = 32) throws -> Data {
    guard (16...64).contains(count) else { throw Failure.invalidInput }
    var data = Data(count: count)
    let status = data.withUnsafeMutableBytes { buffer in
      SecRandomCopyBytes(kSecRandomDefault, count, buffer.baseAddress!)
    }
    guard status == errSecSuccess else { throw Failure.randomFailure }
    return data
  }

  struct Registration {
    let credentialID: Data
    let key: SymmetricKey?
  }

  func register(name: String, userID: Data, salt: Data) async throws -> Registration {
    guard !name.isEmpty, name.utf8.count <= 256, (16...64).contains(userID.count), salt.count == 32 else {
      throw Failure.invalidInput
    }
    let request = provider.createCredentialRegistrationRequest(
      challenge: try Self.randomData(), name: name, userID: userID
    )
    request.userVerificationPreference = .required
    request.prf = .inputValues(.saltInput1(salt))
    let result = try await perform(request)
    guard let registration = result as? ASAuthorizationPlatformPublicKeyCredentialRegistration,
          (1...1024).contains(registration.credentialID.count) else {
      throw Failure.unexpectedCredential
    }
    guard let output = registration.prf, output.isSupported else { throw Failure.unsupportedPRF }
    if let key = output.first, key.bitCount != 256 { throw Failure.unsupportedPRF }
    return Registration(credentialID: registration.credentialID, key: output.first)
  }

  func key(credentialID: Data, salt: Data) async throws -> SymmetricKey {
    guard (1...1024).contains(credentialID.count), salt.count == 32 else {
      throw Failure.invalidInput
    }
    let request = provider.createCredentialAssertionRequest(challenge: try Self.randomData())
    request.userVerificationPreference = .required
    request.allowedCredentials = [ASAuthorizationPlatformPublicKeyCredentialDescriptor(credentialID: credentialID)]
    request.prf = .inputValues(.saltInput1(salt))
    let result = try await perform(request)
    guard let assertion = result as? ASAuthorizationPlatformPublicKeyCredentialAssertion,
          assertion.credentialID == credentialID else { throw Failure.unexpectedCredential }
    guard let prf = assertion.prf, prf.first.bitCount == 256 else { throw Failure.unsupportedPRF }
    return prf.first
  }

  private func perform(_ request: ASAuthorizationRequest) async throws -> ASAuthorizationCredential {
    guard continuation == nil else { throw Failure.busy }
    // Registration's completion can arrive while the system sheet is still
    // dismissing. Wait briefly for foreground before its follow-up assertion;
    // never continue a credential prompt after the app enters background.
    for _ in 0..<20 where UIApplication.shared.applicationState == .inactive {
      try await Task.sleep(nanoseconds: 100_000_000)
    }
    guard UIApplication.shared.applicationState == .active,
          anchor.windowScene?.activationState == .foregroundActive else { throw Failure.unavailable }
    return try await withCheckedThrowingContinuation { pending in
      continuation = pending
      let controller = ASAuthorizationController(authorizationRequests: [request])
      self.controller = controller
      controller.delegate = self
      controller.presentationContextProvider = self
      controller.performRequests()
    }
  }

  func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor { anchor }

  func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
    finish(controller, result: .success(authorization.credential))
  }

  func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
    finish(controller, result: .failure(error))
  }

  private func finish(_ sender: ASAuthorizationController, result: Result<ASAuthorizationCredential, Error>) {
    guard sender === controller, let pending = continuation else { return }
    continuation = nil
    controller = nil
    pending.resume(with: result)
  }
}

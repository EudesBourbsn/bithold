import Foundation
import UIKit
import Network
import Security
import CryptoKit
import LocalAuthentication
import UserNotifications
import React

@objc(BitholdWallet)
final class BitholdWallet: RCTEventEmitter {
  private let io = DispatchQueue(label: "bithold.wallet.io")
  private var sockets: [String: WalletSocket] = [:]
  override static func requiresMainQueueSetup() -> Bool { false }
  override func supportedEvents() -> [String]! { ["walletSocket", "walletRecoveryPrivacy"] }
  private var recoveryProtected = false
  private var recoveryCovers: [UIView] = []
  private var recoveryObservers: [NSObjectProtocol] = []
  @objc(setRecoveryPrivacy:)
  func setRecoveryPrivacy(_ enabled: Bool) {
    DispatchQueue.main.async {
      self.recoveryProtected = enabled
      self.recoveryObservers.forEach { NotificationCenter.default.removeObserver($0) }
      self.recoveryObservers.removeAll()
      if enabled {
        let names: [Notification.Name] = [
          UIApplication.willResignActiveNotification,
          UIApplication.didEnterBackgroundNotification,
          UIApplication.didBecomeActiveNotification,
          UIScene.willDeactivateNotification,
          UIScene.didEnterBackgroundNotification,
          UIScene.didActivateNotification,
          UIScreen.capturedDidChangeNotification
        ]
        for name in names {
          self.recoveryObservers.append(NotificationCenter.default.addObserver(forName: name, object: nil, queue: .main) { [weak self] event in
            guard let self = self else { return }
            let inactive: Bool?
            switch event.name {
            case UIApplication.willResignActiveNotification,
                 UIApplication.didEnterBackgroundNotification,
                 UIScene.willDeactivateNotification,
                 UIScene.didEnterBackgroundNotification:
              inactive = true
            case UIApplication.didBecomeActiveNotification, UIScene.didActivateNotification:
              inactive = false
            default:
              inactive = nil
            }
            self.updateRecoveryCover(inactive: inactive, changedScene: event.object as? UIScene)
            if event.name == UIScreen.capturedDidChangeNotification {
              self.sendEvent(withName: "walletRecoveryPrivacy", body: [:])
            }
          })
        }
      }
      self.updateRecoveryCover()
    }
  }
  private func updateRecoveryCover(inactive: Bool? = nil, changedScene: UIScene? = nil) {
    recoveryCovers.forEach { $0.removeFromSuperview() }; recoveryCovers.removeAll()
    guard recoveryProtected else { return }
    for scene in UIApplication.shared.connectedScenes.compactMap({ $0 as? UIWindowScene }) {
      let sceneInactive = (changedScene == nil || changedScene === scene)
        ? (inactive ?? (scene.activationState != .foregroundActive))
        : scene.activationState != .foregroundActive
      guard sceneInactive || scene.screen.isCaptured else { continue }
      for window in scene.windows where !window.isHidden {
        let cover = UIView(frame: window.bounds)
        cover.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        cover.backgroundColor = UIColor(white: 0.12, alpha: 1)
        cover.accessibilityViewIsModal = true
        cover.accessibilityLabel = "Recovery material hidden"
        window.addSubview(cover); recoveryCovers.append(cover)
      }
    }
  }
  private func notificationStatus(_ settings: UNNotificationSettings) -> String {
    switch settings.authorizationStatus {
    case .notDetermined: return "notDetermined"
    case .denied: return "denied"
    case .authorized: return "authorized"
    case .provisional: return "provisional"
    case .ephemeral: return "ephemeral"
    @unknown default: return "unknown"
    }
  }
  @objc(getNotificationPermission:rejecter:)
  func getNotificationPermission(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    UNUserNotificationCenter.current().getNotificationSettings { settings in
      resolve(self.notificationStatus(settings))
    }
  }
  @objc(requestNotificationPermission:rejecter:)
  func requestNotificationPermission(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let center = UNUserNotificationCenter.current()
      center.requestAuthorization(options: [.alert, .sound, .badge]) { _, error in
        if let error = error {
          reject("notification_permission", "Unable to request notification permission", error)
          return
        }
        center.getNotificationSettings { settings in
          resolve(self.notificationStatus(settings))
        }
      }
    }
  }
  @objc(randomBytes:resolver:rejecter:)
  func randomBytes(_ count: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard (16...64).contains(count) else { reject("entropy", "Invalid entropy size", nil); return }
    var bytes = [UInt8](repeating: 0, count: count)
    guard SecRandomCopyBytes(kSecRandomDefault, count, &bytes) == errSecSuccess else { reject("entropy", "Secure randomness unavailable", nil); return }
    resolve(bytes.map { String(format: "%02x", $0) }.joined())
    bytes.withUnsafeMutableBytes { $0.initializeMemory(as: UInt8.self, repeating: 0) }
  }
  private func storageURL(_ key: String) throws -> URL {
    guard !key.isEmpty, key.utf8.count <= 256 else { throw NSError(domain: "Storage", code: 1) }
    var root = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0].appendingPathComponent("WalletState", isDirectory: true)
    try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true, attributes: [.protectionKey: FileProtectionType.complete, .posixPermissions: 0o700])
    var values = URLResourceValues(); values.isExcludedFromBackup = true; try root.setResourceValues(values)
    let name = SHA256.hash(data: Data(key.utf8)).map { String(format: "%02x", $0) }.joined()
    return root.appendingPathComponent(name + ".json")
  }
  @objc(storageGet:resolver:rejecter:)
  func storageGet(_ key: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    io.async {
      do {
        let url = try self.storageURL(key)
        guard FileManager.default.fileExists(atPath: url.path) else { resolve(NSNull()); return }
        let data = try Data(contentsOf: url)
        guard data.count <= 64_000_000, let text = String(data: data, encoding: .utf8) else { throw NSError(domain: "Storage", code: 2) }
        resolve(text)
      } catch { reject("storage", "Unable to read local wallet data. Unlock the device and try again.", nil) }
    }
  }
  @objc(storageSet:value:resolver:rejecter:)
  func storageSet(_ key: String, value: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    io.async {
      do {
        guard let data = value.data(using: .utf8), data.count <= 64_000_000 else { throw NSError(domain: "Storage", code: 3) }
        let url = try self.storageURL(key)
        try data.write(to: url, options: [.atomic, .completeFileProtection])
        try FileManager.default.setAttributes([.posixPermissions: 0o600, .protectionKey: FileProtectionType.complete], ofItemAtPath: url.path)
        resolve(true)
      } catch { reject("storage", "Unable to save local wallet data", nil) }
    }
  }
  @objc(storageRemove:resolver:rejecter:)
  func storageRemove(_ key: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    io.async {
      do {
        let url = try self.storageURL(key)
        if FileManager.default.fileExists(atPath: url.path) { try FileManager.default.removeItem(at: url) }
        resolve(true)
      } catch { reject("storage", "Unable to remove local wallet data", nil) }
    }
  }
  @objc(authorize:resolver:rejecter:)
  func authorize(_ reason: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let context = LAContext()
    context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: reason) { success, error in
      if success { resolve(true) } else { reject("authentication", "Authentication was not completed", error) }
    }
  }
  // Face ID / Touch ID availability for the lock settings: the kind of sensor, whether it
  // can be used now, why not, and the enrolment state (which changes when faces are added
  // or removed, so the app can require the passcode again).
  @objc(biometry:rejecter:)
  func biometry(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let context = LAContext()
    var failure: NSError?
    let available = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &failure)
    let type: String
    switch context.biometryType {
    case .faceID: type = "faceID"
    case .touchID: type = "touchID"
    default: type = "none"
    }
    var reason: String? = nil
    if let code = failure.map({ LAError.Code(rawValue: $0.code) }) ?? nil {
      switch code {
      case .biometryNotEnrolled: reason = "notEnrolled"
      case .biometryNotAvailable: reason = "notAvailable"
      case .biometryLockout: reason = "lockout"
      case .passcodeNotSet: reason = "passcodeNotSet"
      default: reason = "unavailable"
      }
    }
    var domainState: Data? = nil
    if #available(iOS 18.0, *) {
      domainState = context.domainState.biometry.stateHash
    } else {
      domainState = context.evaluatedPolicyDomainState
    }
    resolve(["type": type, "available": available, "reason": reason as Any,
             "domainState": domainState?.base64EncodedString() as Any])
  }
  // Biometrics only, with no device-passcode fallback: the app's own passcode is the fallback.
  @objc(authenticateBiometrics:resolver:rejecter:)
  func authenticateBiometrics(_ reason: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let context = LAContext()
    context.localizedFallbackTitle = ""
    context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, error in
      if success { resolve(true); return }
      let name: String
      switch (error as? LAError)?.code {
      case .userCancel?, .appCancel?, .systemCancel?: name = "cancelled"
      case .userFallback?: name = "fallback"
      case .biometryLockout?: name = "lockout"
      case .biometryNotEnrolled?: name = "notEnrolled"
      case .biometryNotAvailable?: name = "notAvailable"
      default: name = "failed"
      }
      reject(name, "Authentication was not completed", error)
    }
  }
  // options: tls (default true), pin (SHA-256 hex of the certificate trusted for this server),
  // trustUnknown (accept a certificate iOS does not trust when no pin exists: first connection to a
  // self-signed server). Resolves {session, fingerprint, trusted} so the app can pin the certificate.
  @objc(connect:port:options:resolver:rejecter:)
  func connect(_ host: String, port: Int, options: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let name = host.lowercased()
    guard !host.isEmpty, host.count < 254, (1...65535).contains(port),
          host.rangeOfCharacter(from: .whitespacesAndNewlines.union(.controlCharacters)) == nil,
          !name.hasSuffix(".onion"), !name.hasSuffix(".onion.") else { reject("connection", "Invalid server", nil); return }
    let tls = (options["tls"] as? Bool) ?? true
    // A pin is the lowercase hex SHA-256 of a certificate; anything else is ignored.
    let pin = (options["pin"] as? String).flatMap { value -> String? in
      let lower = value.lowercased()
      return lower.range(of: "^[0-9a-f]{64}$", options: .regularExpression) != nil ? lower : nil
    }
    let trustUnknown = (options["trustUnknown"] as? Bool) ?? false
    io.async {
      let id = UUID().uuidString
      let socket = WalletSocket(host: host, port: UInt16(port), tls: tls, pin: pin, trustUnknown: trustUnknown, queue: self.io) { [weak self] value in
        self?.sendEvent(withName: "walletSocket", body: ["session": id, "message": value])
      }
      self.sockets[id] = socket
      socket.open { error, code in
        if let error { self.sockets[id] = nil; reject(code, error, nil) }
        else { resolve(["session": id, "fingerprint": socket.fingerprint as Any, "trusted": socket.systemTrusted]) }
      }
    }
  }
  @objc(exchange:payload:timeout:resolver:rejecter:)
  func exchange(_ id: String, payload: String, timeout: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    io.async {
      guard let socket = self.sockets[id] else { reject("disconnected", "Server disconnected", nil); return }
      socket.exchange(payload, timeout: min(15, max(1, timeout))) { result in
        switch result {
        case .success(let value): resolve(value)
        case .failure(let error): reject("network", error.localizedDescription, nil)
        }
      }
    }
  }
  @objc(close:resolver:rejecter:)
  func close(_ id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    io.async { self.sockets.removeValue(forKey: id)?.close(); resolve(true) }
  }
  override func invalidate() {
    setRecoveryPrivacy(false)
    io.async { self.sockets.values.forEach { $0.close() }; self.sockets.removeAll() }
    super.invalidate()
  }
}

private final class WalletSocket {
  var connection: NWConnection!
  let queue: DispatchQueue
  let event: ([String: Any]) -> Void
  let tls: Bool
  let pin: String?
  let trustUnknown: Bool
  let tlsOptions: NWProtocolTLS.Options?
  var fingerprint: String? = nil
  var systemTrusted = false
  var failureCode = "connection"
  var failureMessage: String? = nil
  var opening: ((String?, String) -> Void)?
  var pending: ((Result<String, Error>) -> Void)?
  var expected: [Int] = []
  var responses: [Int: [String: Any]] = [:]
  var buffer = Data()
  var deadline: DispatchWorkItem?
  var closed = false
  init(host: String, port: UInt16, tls: Bool, pin: String?, trustUnknown: Bool, queue: DispatchQueue, event: @escaping ([String: Any]) -> Void) {
    self.queue = queue; self.event = event; self.tls = tls; self.pin = pin; self.trustUnknown = trustUnknown
    tlsOptions = tls ? NWProtocolTLS.Options() : nil
    // The verify block must be in place before NWParameters copies the options.
    installTrust(host: host)
    
    connection = NWConnection(host: .init(host), port: .init(rawValue: port)!, using: tlsOptions.map { NWParameters(tls: $0) } ?? .tcp)
  }
  // A pinned server must present its pinned certificate; otherwise iOS trust decides;
  // otherwise, on the tested first connection only, a self-signed certificate is accepted.
  private func installTrust(host: String) {
    guard let options = tlsOptions else { return }
    let security = options.securityProtocolOptions
    // Every connection runs the verify block: no resumed sessions.
    sec_protocol_options_set_tls_resumption_enabled(security, false)
    if IPv4Address(host) == nil && IPv6Address(host) == nil {
      sec_protocol_options_set_tls_server_name(security, host)
    }
    sec_protocol_options_set_verify_block(security, { [weak self] _, secTrust, complete in
      guard let self else { complete(false); return }
      let trust = sec_trust_copy_ref(secTrust).takeRetainedValue()
      _ = SecTrustSetPolicies(trust, SecPolicyCreateSSL(true, host as CFString))
      var fingerprint: String? = nil
      var selfSigned = false
      if let chain = SecTrustCopyCertificateChain(trust) as? [SecCertificate], let leaf = chain.first {
        fingerprint = SHA256.hash(data: SecCertificateCopyData(leaf) as Data).map { String(format: "%02x", $0) }.joined()
        if let subject = SecCertificateCopyNormalizedSubjectSequence(leaf),
           let issuer = SecCertificateCopyNormalizedIssuerSequence(leaf) {
          selfSigned = chain.count == 1 && (subject as Data) == (issuer as Data)
        }
      }
      self.fingerprint = fingerprint
      if let pin = self.pin {
        if fingerprint == pin { complete(true) } else { self.failureCode = "certificate"; self.failureMessage = "Certificate changed"; complete(false) }
        return
      }
      let trusted = SecTrustEvaluateWithError(trust, nil)
      self.systemTrusted = trusted
      if trusted { complete(true); return }
      if self.trustUnknown, selfSigned, fingerprint != nil { complete(true); return }
      self.failureCode = "certificate"; self.failureMessage = "Untrusted certificate"; complete(false)
    }, queue)
  }
  func open(_ callback: @escaping (String?, String) -> Void) {
    opening = callback
    connection.stateUpdateHandler = { [weak self] state in
      guard let self, !self.closed else { return }
      switch state {
      case .ready:
        // The verify block records a fingerprint on every TLS handshake; a TLS
        // connection that skipped it is not trusted.
        if self.tls && self.fingerprint == nil { self.failureCode = "certificate"; self.fail("Untrusted certificate"); return }
        self.deadline?.cancel(); let callback = self.opening; self.opening = nil
        self.receive(); callback?(nil, "")
      case .failed, .cancelled:
        self.fail(self.failureMessage ?? (self.tls ? "TLS connection failed" : "TCP connection failed"))
      case .waiting(let error):
        // A rejected certificate leaves the connection waiting forever; other
        // waits (no network, DNS) run into the deadline below.
        if case .tls = error { self.fail(self.failureMessage ?? "TLS connection failed") }
      default: break
      }
    }
    arm(6, message: "Connection timed out")
    connection.start(queue: queue)
  }
  func arm(_ seconds: Double, message: String) {
    deadline?.cancel()
    let item = DispatchWorkItem { [weak self] in self?.fail(message) }
    deadline = item; queue.asyncAfter(deadline: .now() + seconds, execute: item)
  }
  func exchange(_ text: String, timeout: Double, completion: @escaping (Result<String, Error>) -> Void) {
    guard !closed, pending == nil, let data = text.data(using: .utf8), data.count < 1_000_000,
          let calls = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]],
          !calls.isEmpty, calls.count <= 100 else {
      completion(.failure(NSError(domain: "Wallet", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid or overlapping server request"]))); return
    }
    expected = calls.compactMap { $0["id"] as? Int }
    guard expected.count == calls.count, Set(expected).count == expected.count else {
      completion(.failure(NSError(domain: "Wallet", code: 2, userInfo: [NSLocalizedDescriptionKey: "Invalid or overlapping server request"]))); return
    }
    pending = completion; responses = [:]
    arm(timeout, message: "Server request timed out")
    // One request goes as a plain JSON-RPC object, which every server takes; only
    // batches need batch support.
    let payload = (calls.count == 1 ? try? JSONSerialization.data(withJSONObject: calls[0]) : nil) ?? data
    connection.send(content: payload + Data([10]), completion: .contentProcessed { [weak self] error in
      if error != nil { self?.fail("Unable to send server request") }
    })
  }
  func receive() {
    connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self] data, _, complete, error in
      guard let self, !self.closed else { return }
      if let data { self.buffer.append(data) }
      guard self.buffer.count < 8_000_000 else { self.fail("Server response too large"); return }
      while let end = self.buffer.firstIndex(of: 10) {
        let line = self.buffer.subdata(in: 0..<end); self.buffer.removeSubrange(0...end)
        guard let parsed = try? JSONSerialization.jsonObject(with: line) else { self.fail("Invalid server response"); return }
        let messages = (parsed as? [[String: Any]]) ?? (parsed as? [String: Any]).map { [$0] } ?? []
        for message in messages {
          if let id = message["id"] as? Int {
            guard self.expected.contains(id), self.responses[id] == nil else { self.fail("Unexpected server response"); return }
            self.responses[id] = message
          } else if message["method"] != nil { self.event(message) }
        }
        if !self.expected.isEmpty, self.responses.count == self.expected.count {
          guard let result = try? JSONSerialization.data(withJSONObject: self.expected.compactMap { self.responses[$0] }),
                let text = String(data: result, encoding: .utf8) else { self.fail("Invalid server response"); return }
          let callback = self.pending; self.pending = nil; self.expected = []; self.responses = [:]; self.deadline?.cancel()
          callback?(.success(text))
        }
      }
      if complete || error != nil { self.fail("Server disconnected") } else { self.receive() }
    }
  }
  func fail(_ message: String) {
    guard !closed else { return }; closed = true
    deadline?.cancel(); connection.cancel()
    let open = opening; opening = nil; open?(message, failureCode)
    let callback = pending; pending = nil
    callback?(.failure(NSError(domain: "Wallet", code: 3, userInfo: [NSLocalizedDescriptionKey: message])))
    event(["method": "disconnected"])
  }
  func close() { fail("Connection closed") }
}

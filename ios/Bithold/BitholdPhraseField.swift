import SwiftUI
import Observation
import React

@available(iOS 17.0, *)
@MainActor @Observable final class BitholdPhraseDraft {
    var text = "" {
        didSet { if text != oldValue { textRevision &+= 1 } }
    }
    var textRevision = 0
    var selection = NSRange(location: 0, length: 0)
    var isComposing = false
    var editRevision = 0
    var externalRevision = 0
    var focused = false
    var eligible = true
    var enabled = true
    var fillColor: UIColor = .clear
    var textColor: UIColor = .label
    var placeholderColor: UIColor = .placeholderText
    var cursorColor: UIColor = .systemBlue
    var dividerColor: UIColor = .clear
    var actionHeight: CGFloat = 44
    var words: [String] = []
    var alertMessage: String?
    // Labels in the app's language, sent from JS; English until they arrive.
    var strings: [String: String] = [:]
    func text(_ key: String, _ fallback: String) -> String { strings[key] ?? fallback }
    @ObservationIgnored var changed: ((String, Bool, Int) -> Void)?
    @ObservationIgnored var feedback: (() -> Void)?
    @ObservationIgnored var caretChanged: ((UIView, CGRect, Int) -> Void)?
    var suggestions: [String] {
        guard !isComposing, enabled else { return [] }
        return BitholdPhraseCompletion.suggestions(text, selection: selection, words: words)
    }
    func publish() { changed?(text, isComposing, externalRevision) }
    func rejectInput() { alertMessage = text("inputLimit", "The input exceeds the 16,384-character limit.") }
    func replace(_ value: String) {
        guard value.utf16.count <= BitholdPhraseCompletion.maximumInputLength else { rejectInput(); return }
        text = value
        selection = NSRange(location: value.utf16.count, length: 0)
        isComposing = false
        editRevision &+= 1
        publish()
    }
    func complete(_ word: String) {
        guard enabled, eligible, !isComposing,
              let result = BitholdPhraseCompletion.complete(word, text: text, selection: selection, words: words) else { return }
        text = result.0
        selection = result.1
        editRevision &+= 1
        feedback?()
        publish()
    }
    func clear() { replace("") }
}

@available(iOS 17.0, *)
private struct PhraseFieldContent: View {
    @Bindable var draft: BitholdPhraseDraft
    let scan: () -> Void
    let measured: (CGFloat) -> Void
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topLeading) {
                BitholdPhraseTextInput(draft: draft, isFocused: $draft.focused)
                if draft.text.isEmpty {
                    Text(draft.text("placeholder", "Recovery phrase"))
                        .font(.body)
                        .foregroundStyle(Color(uiColor: draft.placeholderColor))
                        .padding(BitholdPhraseTextInput.contentPadding)
                        .allowsHitTesting(false)
                        .accessibilityHidden(true)
                }
            }
            HStack {
                Spacer(minLength: 0)
                actions
            }.padding(6)
        }
        .background(Color(uiColor: draft.fillColor), in: .rect(cornerRadius: 26))
        .fixedSize(horizontal: false, vertical: true)
        .background(GeometryReader { proxy in
            Color.clear.preference(key: PhraseHeight.self, value: proxy.size.height)
        })
        .onPreferenceChange(PhraseHeight.self, perform: measured)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .disabled(!draft.enabled || !draft.eligible)
        .environment(\.colorScheme, .dark)
        .accessibilityElement(children: .contain)
        .alert(draft.text("inputAlertTitle", "Unable to enter input"), isPresented: Binding(get: { draft.alertMessage != nil }, set: { if !$0 { draft.alertMessage = nil } })) {
            Button(draft.text("ok", "OK")) { draft.alertMessage = nil }
        } message: { Text(draft.alertMessage ?? "") }
    }
    private var actions: some View {
        let replacement: AnyTransition = reduceMotion ? .opacity : AnyTransition(.blurReplace)
        return ZStack(alignment: .trailing) {
            if !draft.text.isEmpty {
                action(draft.text("clear", "Clear"), identifier: "recovery.clear") {
                    draft.feedback?(); draft.clear(); draft.focused = true
                }.clipShape(.rect(cornerRadius: 20)).transition(replacement)
            } else {
                HStack(spacing: 2) {
                    action(draft.text("scan", "Scan"), identifier: "recovery.scan") {
                        draft.feedback?(); draft.focused = false; scan()
                    }
                    action(draft.text("paste", "Paste"), identifier: "recovery.paste") {
                        
                        let value = UIPasteboard.general.string ?? ""
                        guard !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
                            draft.alertMessage = draft.text("pasteEmpty", "Copy your recovery phrase or private key, then tap Paste."); return
                        }
                        draft.feedback?(); draft.replace(value); draft.focused = true
                    }
                }.clipShape(.rect(cornerRadius: 20)).transition(replacement)
            }
        }.animation(reduceMotion ? .easeOut(duration: 0.12) : .smooth(duration: 0.25), value: !draft.text.isEmpty)
    }
    private func action(_ title: String, identifier: String, perform: @escaping () -> Void) -> some View {
        Button(action: perform) {
            Text(title).font(.subheadline.weight(.semibold))
                .foregroundStyle(Color(uiColor: .secondaryLabel))
                .fixedSize(horizontal: true, vertical: true)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .frame(minHeight: draft.actionHeight).background(Color.primary.opacity(0.07))
                .contentShape(Rectangle())
        }.buttonStyle(.plain).accessibilityIdentifier(identifier)
    }
}
private struct PhraseHeight: PreferenceKey {
    static let defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) { value = nextValue() }
}

@available(iOS 17.0, *)
@objc(BitholdPhraseFieldView)
final class BitholdPhraseFieldView: UIView {
    let draft = BitholdPhraseDraft()
    private var host: UIHostingController<PhraseFieldContent>!
    private var lastHeight: CGFloat = 0
    private var pendingFocus = false
    @objc var onInput: RCTDirectEventBlock? { didSet { draft.publish() } }
    @objc var onHeight: RCTDirectEventBlock? { didSet { if lastHeight > 0 { onHeight?(["height": lastHeight]) } } }
    @objc var onScan: RCTDirectEventBlock?
    @objc var onFeedback: RCTDirectEventBlock?
    @objc var onCaret: RCTDirectEventBlock?
    @objc var vocabulary: [String] = [] { didSet { draft.words = vocabulary } }
    @objc var actionHeight: CGFloat = 44 { didSet {
        guard actionHeight.isFinite, actionHeight > 0 else { return }
        draft.actionHeight = actionHeight
    } }
    @objc var fillColor: UIColor = .clear { didSet { draft.fillColor = fillColor } }
    @objc var textColor: UIColor = .label { didSet { draft.textColor = textColor } }
    @objc var placeholderColor: UIColor = .placeholderText { didSet { draft.placeholderColor = placeholderColor } }
    @objc var cursorColor: UIColor = .systemBlue { didSet { draft.cursorColor = cursorColor } }
    @objc var dividerColor: UIColor = .clear { didSet { draft.dividerColor = dividerColor } }
    @objc var strings: NSDictionary? { didSet { draft.strings = strings as? [String: String] ?? [:] } }
    
    @objc var replacement: NSDictionary? {
        didSet {
            guard let value = replacement, let revision = value["revision"] as? Int,
                  revision > draft.externalRevision, let text = value["text"] as? String else { return }
            draft.externalRevision = revision; draft.replace(text)
        }
    }
    @objc var inputEnabled = true { didSet {
        draft.enabled = inputEnabled
        if !inputEnabled { pendingFocus = false; draft.focused = false }
        consumeFocusRequest()
    } }
    @objc var active = true { didSet {
        if !active { pendingFocus = false }
        synchronizeEligibility()
    } }
    @objc var focusRequest = 0 {
        didSet { if focusRequest != oldValue { pendingFocus = true; consumeFocusRequest() } }
    }
    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .clear
        overrideUserInterfaceStyle = .dark
        draft.changed = { [weak self] text, composing, revision in
            guard let self else { return }
            self.onInput?(["hasContent": !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
                           "composing": composing, "revision": revision,
                           "textRevision": self.draft.textRevision])
        }
        draft.feedback = { [weak self] in self?.onFeedback?([:]) }
        draft.caretChanged = { [weak self] source, caret, revision in
            guard let self, self.draft.eligible, self.draft.enabled,
                  self.window != nil, source.isDescendant(of: self),
                  revision == self.draft.externalRevision else { return }
            let rect = source.convert(caret, to: self)
            guard rect.origin.x.isFinite, rect.origin.y.isFinite,
                  rect.width.isFinite, rect.height.isFinite, rect.height > 0 else { return }
            self.onCaret?(["x": rect.origin.x, "y": rect.origin.y,
                           "width": rect.width, "height": rect.height, "revision": revision])
        }
        host = UIHostingController(rootView: PhraseFieldContent(draft: draft, scan: { [weak self] in
            self?.onScan?([:])
        }, measured: { [weak self] height in self?.reportHeight(height) }))
        host.view.backgroundColor = .clear
        host.overrideUserInterfaceStyle = .dark
        if #available(iOS 16.4, *) { host.safeAreaRegions = [] }
        addSubview(host.view)
        NotificationCenter.default.addObserver(self, selector: #selector(suspendInput), name: UIApplication.willResignActiveNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(synchronizeEligibility), name: UIApplication.didBecomeActiveNotification, object: nil)
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) is not supported") }
    override func didMoveToWindow() {
        super.didMoveToWindow()
        if window != nil, host.parent == nil {
            var ancestor: UIResponder? = next
            while let current = ancestor {
                if let controller = current as? UIViewController {
                    controller.addChild(host); host.didMove(toParent: controller); break
                }
                ancestor = current.next
            }
        } else if window == nil, host.parent != nil {
            host.willMove(toParent: nil); host.removeFromParent()
        }
        synchronizeEligibility()
    }
    @objc private func synchronizeEligibility() {
        let eligible = active && window != nil && UIApplication.shared.applicationState == .active
        draft.eligible = eligible
        if !eligible { draft.focused = false; endEditing(true) }
        consumeFocusRequest()
    }
    private func consumeFocusRequest() {
        guard pendingFocus, draft.eligible, draft.enabled, window != nil else { return }
        pendingFocus = false; draft.focused = true
    }
    @objc private func suspendInput() {
        pendingFocus = false
        draft.eligible = false; draft.focused = false; endEditing(true)
    }
    override func layoutSubviews() {
        super.layoutSubviews()
        host.view.frame = bounds
    }
    private func reportHeight(_ height: CGFloat) {
        guard height.isFinite, height > 0, abs(height - lastHeight) > 0.5 else { return }
        lastHeight = height
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            self.onHeight?(["height": ceil(self.lastHeight)])
        }
    }
    func snapshot() throws -> String {
        guard draft.eligible, window != nil else {
            throw NSError(domain: "BitholdPhraseField", code: 2, userInfo: [NSLocalizedDescriptionKey: draft.text("fieldInactive", "The import field is no longer active.")])
        }
        guard !draft.isComposing else {
            throw NSError(domain: "BitholdPhraseField", code: 1, userInfo: [NSLocalizedDescriptionKey: draft.text("composing", "Finish composing the current word before importing.")])
        }
        draft.enabled = false; draft.focused = false; endEditing(true)
        return draft.text
    }
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}

@objc(BitholdPhraseField)
final class BitholdPhraseField: RCTViewManager {
    override static func requiresMainQueueSetup() -> Bool { true }
    override func view() -> UIView! {
        if #available(iOS 17.0, *) { return BitholdPhraseFieldView() }
        return UIView() 
    }
    @objc func snapshot(_ tag: NSNumber, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        bridge.uiManager.addUIBlock { manager, _ in

            guard #available(iOS 17.0, *), let view = manager?.view(forReactTag: tag) as? BitholdPhraseFieldView else {
                reject("field_unavailable", "The import field is no longer available.", nil); return
            }
            do { resolve(try view.snapshot()) }
            catch { reject("input_composing", error.localizedDescription, error) }
        }
    }
}

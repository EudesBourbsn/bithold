import SwiftUI
import UIKit

@available(iOS 17.0, *)
@MainActor struct BitholdPhraseTextInput: UIViewRepresentable {
    static let contentPadding: CGFloat = 16
    @Bindable var draft: BitholdPhraseDraft
    @Binding var isFocused: Bool

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    func makeUIView(context: Context) -> InputView {
        let view = InputView()
        view.delegate = context.coordinator
        
        view.backgroundColor = .clear
        view.isScrollEnabled = false
        view.textContainerInset = UIEdgeInsets(top: Self.contentPadding, left: Self.contentPadding,
                                              bottom: Self.contentPadding, right: Self.contentPadding)
        view.textContainer.lineFragmentPadding = 0
        view.adjustsFontForContentSizeCategory = true
        let font = UIFont.preferredFont(forTextStyle: .body)
        if view.font != font { view.font = font }
        view.textColor = draft.textColor
        
        view.semanticContentAttribute = .forceLeftToRight
        view.textAlignment = .left
        view.autocorrectionType = .no
        view.autocapitalizationType = .none
        view.spellCheckingType = .no
        view.smartQuotesType = .no
        view.smartDashesType = .no
        view.smartInsertDeleteType = .no
        view.inlinePredictionType = .no
        view.textContentType = nil
        view.returnKeyType = .done
        view.enablesReturnKeyAutomatically = true
        if #available(iOS 18.0, *) { view.writingToolsBehavior = .none }
        view.inputAssistantItem.leadingBarButtonGroups = []
        view.inputAssistantItem.trailingBarButtonGroups = []
        view.accessibilityIdentifier = "recovery.phrase"
        context.coordinator.accessory.sizeToFit()
        view.inputAccessoryView = context.coordinator.accessory
        return view
    }

    func updateUIView(_ view: InputView, context: Context) {
        let coordinator = context.coordinator
        coordinator.parent = self
        coordinator.accessory.updateAppearance(context.environment.colorScheme == .dark ? .dark : .light)
        coordinator.updating = true
        defer { coordinator.updating = false }
        view.accessibilityLabel = draft.text("inputLabel", "Recovery phrase, key or descriptor")
        view.accessibilityHint = draft.text("inputHint", "Enter your recovery phrase, private key or descriptor.")
        let font = UIFont.preferredFont(forTextStyle: .body)
        if view.font != font { view.font = font }
        if coordinator.editRevision != draft.editRevision {
            coordinator.editRevision = draft.editRevision
            view.unmarkText()
            view.undoManager?.removeAllActions()

            if view.text != draft.text { view.text = draft.text; view.invalidateIntrinsicContentSize() }
            if view.selectedRange != draft.selection, Range(draft.selection, in: draft.text) != nil {
                view.selectedRange = draft.selection
            }
        }
        coordinator.refreshToolbar(composing: view.markedTextRange != nil)
        view.isEditable = draft.enabled
        view.textColor = draft.textColor
        view.tintColor = draft.cursorColor
        view.wantsFocus = isFocused && draft.eligible && draft.enabled
        view.canFocus = { [weak draft] in
            guard let draft else { return false }
            return draft.focused && draft.eligible && draft.enabled
        }
        view.caretRevision = draft.externalRevision
        view.onCaret = { [weak draft] source, rect, revision in
            draft?.caretChanged?(source, rect, revision)
        }
        view.scheduleCaretReport()
    }

    func sizeThatFits(_ proposal: ProposedViewSize, uiView: InputView, context: Context) -> CGSize? {
        guard let width = proposal.width, width > 0, width.isFinite else { return nil }
        let content = uiView.sizeThatFits(CGSize(width: width, height: .greatestFiniteMagnitude))

        let lineHeight = (uiView.font ?? UIFont.preferredFont(forTextStyle: .body)).lineHeight
        let minimumHeight = ceil(lineHeight * 3) + uiView.textContainerInset.top + uiView.textContainerInset.bottom
        return CGSize(width: width, height: max(content.height, minimumHeight))
    }

    static func dismantleUIView(_ view: InputView, coordinator: Coordinator) {
        view.delegate = nil
        view.wantsFocus = false
        view.canFocus = nil
        view.onCaret = nil
        view.removeOutsideSelectionTap()
        view.resignFirstResponder()
        view.undoManager?.removeAllActions()
        view.text = ""
        view.inputAccessoryView = nil
        coordinator.toolbar.clear()
        coordinator.parent.draft.changed = nil
        coordinator.parent.draft.feedback = nil
        coordinator.parent.draft.caretChanged = nil
        coordinator.parent.draft.clear()
    }

    final class InputView: UITextView {
        var canFocus: (() -> Bool)?
        var onCaret: ((UIView, CGRect, Int) -> Void)?
        var caretRevision = 0
        var wantsFocus = false { didSet { if wantsFocus != oldValue { synchronizeFocus() } } }
        private var focusUpdateScheduled = false
        private var caretReportScheduled = false
        private var lastCaret: CGRect?
        private var lastCaretRevision = -1
        private lazy var outsideSelectionTap = OutsideSelectionTap(textView: self)

        func removeOutsideSelectionTap() {
            outsideSelectionTap.view?.removeGestureRecognizer(outsideSelectionTap)
        }

        private func attachOutsideSelectionTap() {
            removeOutsideSelectionTap()
            guard window != nil else { return }
            var content: UIView = self
            while let ancestor = content.superview, !(ancestor is UIWindow) {
                content = ancestor
            }
            if content !== self { content.addGestureRecognizer(outsideSelectionTap) }
        }

        override func layoutSubviews() {
            super.layoutSubviews()
            scheduleCaretReport()
        }
        func scheduleCaretReport(reset: Bool = false) {
            if reset { lastCaret = nil }
            guard !caretReportScheduled else { return }
            caretReportScheduled = true
            DispatchQueue.main.async { [weak self] in
                guard let self else { return }
                self.caretReportScheduled = false
                guard self.window != nil, self.isFirstResponder, self.canFocus?() == true,
                      let onCaret = self.onCaret else { return }
                self.layoutIfNeeded()
                guard let selection = self.selectedTextRange else { return }
                guard selection.isEmpty else {
                    self.lastCaret = nil
                    return
                }
                let rect = self.caretRect(for: selection.end)
                guard rect.origin.x.isFinite, rect.origin.y.isFinite,
                      rect.width.isFinite, rect.height.isFinite, rect.height > 0,
                      rect != self.lastCaret || self.caretRevision != self.lastCaretRevision else { return }
                self.lastCaret = rect
                self.lastCaretRevision = self.caretRevision
                onCaret(self, rect, self.caretRevision)
            }
        }
        override func didMoveToWindow() {
            super.didMoveToWindow()
            attachOutsideSelectionTap()
            synchronizeFocus()
        }
        private func synchronizeFocus() {
            guard !focusUpdateScheduled else { return }
            focusUpdateScheduled = true

            DispatchQueue.main.async { [weak self] in
                guard let self else { return }
                self.focusUpdateScheduled = false
                guard self.window != nil else { return }
                if self.wantsFocus, self.canFocus?() == true, !self.isFirstResponder {
                    if let accessory = self.inputAccessoryView {
                        accessory.frame.size.width = self.window?.bounds.width ?? self.bounds.width
                        accessory.sizeToFit()
                    }
                    self.becomeFirstResponder()
                } else if !self.wantsFocus, self.isFirstResponder { self.resignFirstResponder() }
            }
        }
    }

    final class OutsideSelectionTap: UITapGestureRecognizer, UIGestureRecognizerDelegate {
        private weak var textView: InputView?

        init(textView: InputView) {
            self.textView = textView
            super.init(target: nil, action: nil)
            addTarget(self, action: #selector(clearSelection))
            delegate = self
            cancelsTouchesInView = false
            delaysTouchesBegan = false
            delaysTouchesEnded = false
        }

        func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
            guard let textView, textView.isFirstResponder, textView.canFocus?() == true,
                  textView.markedTextRange == nil, textView.selectedRange.length > 0,
                  let touched = touch.view,
                  !touched.isDescendant(of: textView) else { return false }
            if let accessory = textView.inputAccessoryView, touched.isDescendant(of: accessory) {
                return false
            }
            for case let interaction as UITextSelectionDisplayInteraction in textView.interactions {
                for handle in interaction.handleViews where !handle.isHidden && handle.alpha > 0 && handle.window != nil {
                    if handle.bounds.insetBy(dx: -16, dy: -16).contains(touch.location(in: handle)) {
                        return false
                    }
                }
            }
            return true
        }

        func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer,
                               shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
            true
        }

        @objc private func clearSelection() {
            guard state == .ended, let textView, textView.isFirstResponder,
                  textView.canFocus?() == true, textView.markedTextRange == nil,
                  textView.selectedRange.length > 0,
                  Range(textView.selectedRange, in: textView.text) != nil else { return }
            textView.selectedRange = NSRange(location: NSMaxRange(textView.selectedRange), length: 0)
            for case let interaction as UIEditMenuInteraction in textView.interactions {
                interaction.dismissMenu()
            }
        }
    }

    final class Coordinator: NSObject, UITextViewDelegate {
        var parent: BitholdPhraseTextInput
        var updating = false
        var editRevision = -1
        let accessory = BitholdPhraseKeyboardAccessory(identifierPrefix: "recovery")
        var toolbar: BitholdPhraseKeyboardToolbar { accessory.toolbar }

        init(_ parent: BitholdPhraseTextInput) { self.parent = parent }

        func refreshToolbar(composing: Bool) {
            toolbar.update(words: composing ? [] : parent.draft.suggestions,
                           doneLabel: parent.draft.text("done", "Done"),
                           dividerColor: parent.draft.dividerColor,
                           onWord: { [weak self] in self?.parent.draft.complete($0) },
                           onDone: { [weak self] in self?.parent.isFocused = false; self?.parent.draft.feedback?() })
        }

        func textViewDidChange(_ textView: UITextView) {
            guard !updating else { return }
            parent.draft.text = textView.text
            if parent.draft.selection != textView.selectedRange { parent.draft.selection = textView.selectedRange }
            parent.draft.isComposing = textView.markedTextRange != nil
            parent.draft.publish()
            textView.invalidateIntrinsicContentSize()
            refreshToolbar(composing: textView.markedTextRange != nil)
            (textView as? InputView)?.scheduleCaretReport()
        }

        func textViewDidChangeSelection(_ textView: UITextView) {
            guard !updating else { return }
            let composing = textView.markedTextRange != nil
            let compositionChanged = parent.draft.isComposing != composing
            let changed = parent.draft.selection != textView.selectedRange || parent.draft.isComposing != composing
            guard changed else { return }
            if parent.draft.selection != textView.selectedRange { parent.draft.selection = textView.selectedRange }
            if parent.draft.isComposing != composing { parent.draft.isComposing = composing }
            if parent.draft.text == textView.text {
                if compositionChanged { parent.draft.publish() }
                refreshToolbar(composing: composing)
            }
            (textView as? InputView)?.scheduleCaretReport()
        }

        func textViewShouldBeginEditing(_ textView: UITextView) -> Bool {
            parent.draft.enabled && parent.draft.eligible
        }
        func textViewDidBeginEditing(_ textView: UITextView) {
            if !updating, !parent.isFocused { parent.isFocused = true }
            (textView as? InputView)?.scheduleCaretReport(reset: true)
        }
        func textViewDidEndEditing(_ textView: UITextView) {
            if !updating, parent.isFocused { parent.isFocused = false }
        }

        func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
            guard parent.draft.enabled, parent.draft.eligible else { return false }
            if text == "\n", textView.markedTextRange == nil {
                parent.isFocused = false
                return false
            }
            guard Range(range, in: textView.text) != nil else { return false }
            let count = textView.text.utf16.count - range.length + text.utf16.count
            guard count <= BitholdPhraseCompletion.maximumInputLength else {
                parent.draft.rejectInput()
                return false
            }
            return true
        }
    }

}


import Foundation

enum BitholdPhraseCompletion {
    static let maximumInputLength = 16_384
    struct Context { let range: NSRange; let prefix: String }
    static func normalize(_ value: String) -> String {
        value.decomposedStringWithCompatibilityMapping.lowercased(with: Locale(identifier: "en_US_POSIX"))
    }
    static func context(_ text: String, selection: NSRange) -> Context? {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        let opaque = trimmed.range(of: "^(?:[5KLc9][1-9A-HJ-NP-Za-km-z]{49,51}$|[xyztuvYZUV](?:pub|prv)|bc1|tb1|bcrt1)", options: .regularExpression) != nil
        guard text.utf16.count <= maximumInputLength,
              !opaque,
              selection.location != NSNotFound,
              let selected = Range(selection, in: text),
              
              text.allSatisfy({ $0.isWhitespace || $0.isLetter }) else { return nil }
        var start = text.startIndex
        while start < text.endIndex {
            if text[start].isWhitespace { start = text.index(after: start); continue }
            var end = start
            while end < text.endIndex, !text[end].isWhitespace { end = text.index(after: end) }
            if selected.lowerBound > start, selected.lowerBound <= end, selected.upperBound <= end {
                return Context(range: NSRange(start..<end, in: text), prefix: normalize(String(text[start..<selected.lowerBound])))
            }
            start = end
        }
        return nil
    }
    static func suggestions(_ text: String, selection: NSRange, words: [String]) -> [String] {
        guard let context = context(text, selection: selection) else { return [] }
        return Array(words.lazy.filter { $0.hasPrefix(context.prefix) }.prefix(32))
    }
    static func complete(_ word: String, text: String, selection: NSRange, words: [String]) -> (String, NSRange)? {
        guard words.contains(word), let context = context(text, selection: selection),
              normalize(word).hasPrefix(context.prefix), let range = Range(context.range, in: text) else { return nil }
        var end = range.upperBound
        if end < text.endIndex, text[end].isWhitespace { end = text.index(after: end) }
        let replacement = word + " "
        let updated = String(text[..<range.lowerBound]) + replacement + String(text[end...])
        guard updated.utf16.count <= maximumInputLength else { return nil }
        return (updated, NSRange(location: context.range.location + replacement.utf16.count, length: 0))
    }
}

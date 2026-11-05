#!/usr/bin/env swift
import AppKit
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let project = URL(
  fileURLWithPath: CommandLine.arguments.count > 1
    ? CommandLine.arguments[1] : FileManager.default.currentDirectoryPath)
let output = URL(
  fileURLWithPath: CommandLine.arguments.count > 2
    ? CommandLine.arguments[2]
    : project.appendingPathComponent("ios/Bithold/Images.xcassets/AppIcon.appiconset").path)
let master = URL(
  fileURLWithPath: CommandLine.arguments.count > 3
    ? CommandLine.arguments[3] : project.appendingPathComponent("assets/branding/app-icon.svg").path
)
let canvas: CGFloat = 1024
let space = CGColorSpace(name: CGColorSpace.sRGB)!
let source = try String(
  contentsOf: project.appendingPathComponent("assets/branding/logo.svg"),
  encoding: .utf8)
let pathPattern = try NSRegularExpression(pattern: #"\bd="([^"]+)""#)
guard
  let match = pathPattern.firstMatch(in: source, range: NSRange(source.startIndex..., in: source)),
  let range = Range(match.range(at: 1), in: source)
else { fatalError("Brand vector path is missing") }
let pathData = String(source[range])
let viewBoxPattern = try NSRegularExpression(pattern: #"\bviewBox="([^"]+)""#)
guard
  let viewBoxMatch = viewBoxPattern.firstMatch(in: source, range: NSRange(source.startIndex..., in: source)),
  let viewBoxRange = Range(viewBoxMatch.range(at: 1), in: source)
else { fatalError("Brand vector viewBox is missing") }
let viewBox = String(source[viewBoxRange])
let geometryData = try JSONSerialization.data(
  withJSONObject: ["viewBox": viewBox, "path": pathData], options: [.prettyPrinted, .sortedKeys])
let geometry = "export const brandMark = Object.freeze(\(String(data: geometryData, encoding: .utf8)!));\n"
try geometry.write(
  to: project.appendingPathComponent("src/components/branding/brandMark.js"),
  atomically: true, encoding: .utf8)


struct Stop {
  let offset: CGFloat
  let hex: String
  let alpha: CGFloat
  init(_ offset: CGFloat, _ hex: String, _ alpha: CGFloat = 1) {
    self.offset = offset
    self.hex = hex
    self.alpha = alpha
  }
  var color: CGColor {
    let rgb = UInt32(hex.dropFirst(), radix: 16)!
    return CGColor(
      colorSpace: space,
      components: [
        CGFloat((rgb >> 16) & 255) / 255, CGFloat((rgb >> 8) & 255) / 255, CGFloat(rgb & 255) / 255,
        alpha,
      ])!
  }
  var svg: String { "<stop offset=\"\(offset)\" stop-color=\"\(hex)\" stop-opacity=\"\(alpha)\"/>" }
}
struct Glow {
  let id: String
  let x: CGFloat
  let y: CGFloat
  let rx: CGFloat
  let ry: CGFloat
  let rotation: CGFloat
  let stops: [Stop]
}
let background = [Stop(0, "#213B59"), Stop(0.5, "#142840"), Stop(1, "#09101D")]
let glows = [
  Glow(
    id: "upper", x: 0.74, y: -0.05, rx: 0.6, ry: 0.9, rotation: 28,
    stops: [Stop(0, "#62ACE9", 0.32), Stop(0.58, "#2F7EC3", 0.20), Stop(1, "#2F7EC3", 0)]),
  Glow(
    id: "lower-spill", x: 0.5, y: 1.02, rx: 0.58, ry: 0.86, rotation: 0,
    stops: [Stop(0, "#2F7EC3", 0.50), Stop(0.55, "#2F7EC3", 0.32), Stop(1, "#2F7EC3", 0)]),
  Glow(
    id: "lower", x: 0.5, y: 1.03, rx: 0.34, ry: 0.92, rotation: 0,
    stops: [
      Stop(0, "#439BFB"), Stop(0.26, "#2F7EC3", 0.96), Stop(0.64, "#2F7EC3", 0.56),
      Stop(1, "#2F7EC3", 0),
    ]),
]

func vectorPath(_ data: String) throws -> CGPath {
  let tokenizer = try NSRegularExpression(
    pattern: #"[A-Za-z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?"#)
  let tokens = tokenizer.matches(in: data, range: NSRange(data.startIndex..., in: data)).map {
    String(data[Range($0.range, in: data)!])
  }
  let path = CGMutablePath()
  var i = 0
  var command = ""
  func number() -> CGFloat {
    guard i < tokens.count, let value = Double(tokens[i]) else {
      fatalError("Invalid vector coordinate")
    }
    i += 1
    return CGFloat(value)
  }
  while i < tokens.count {
    if tokens[i].first!.isLetter {
      command = tokens[i]
      i += 1
    }
    switch command {
    case "M":
      path.move(to: CGPoint(x: number(), y: number()))
      command = "L"
    case "L": path.addLine(to: CGPoint(x: number(), y: number()))
    case "H": path.addLine(to: CGPoint(x: number(), y: path.currentPoint.y))
    case "V": path.addLine(to: CGPoint(x: path.currentPoint.x, y: number()))
    case "C":
      let c1 = CGPoint(x: number(), y: number())
      let c2 = CGPoint(x: number(), y: number())
      let end = CGPoint(x: number(), y: number())
      path.addCurve(to: end, control1: c1, control2: c2)
    case "Z":
      path.closeSubpath()
      command = ""
    default: fatalError("Unsupported brand path command: \(command)")
    }
  }
  return path
}
let logo = try vectorPath(pathData)
let bounds = logo.boundingBoxOfPath
let logoScale = canvas * 0.64 / bounds.height
let logoX = (canvas - bounds.width * logoScale) / 2 - bounds.minX * logoScale
let logoY = canvas * 0.18 - bounds.minY * logoScale
func gradient(_ stops: [Stop]) -> CGGradient {
  CGGradient(
    colorsSpace: space, colors: stops.map(\.color) as CFArray, locations: stops.map(\.offset))!
}
func context(_ size: Int) -> CGContext {
  guard
    let value = CGContext(
      data: nil, width: size, height: size, bitsPerComponent: 8, bytesPerRow: size * 4,
      space: space, bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)
  else { fatalError("Unable to create icon canvas") }
  value.interpolationQuality = .high
  return value
}
func render(_ size: Int) -> CGImage {
  let pixels = size * (size < 1024 ? 4 : 2)
  let ctx = context(pixels)
  ctx.translateBy(x: 0, y: CGFloat(pixels))
  ctx.scaleBy(x: CGFloat(pixels) / canvas, y: -CGFloat(pixels) / canvas)
  ctx.drawLinearGradient(
    gradient(background), start: .zero, end: CGPoint(x: 0, y: canvas),
    options: [.drawsBeforeStartLocation, .drawsAfterEndLocation])
  for glow in glows {
    ctx.saveGState()
    ctx.translateBy(x: glow.x * canvas, y: glow.y * canvas)
    ctx.rotate(by: glow.rotation * .pi / 180)
    ctx.scaleBy(x: glow.rx * canvas, y: glow.ry * canvas)
    ctx.drawRadialGradient(
      gradient(glow.stops), startCenter: .zero, startRadius: 0, endCenter: .zero, endRadius: 1,
      options: [])
    ctx.restoreGState()
  }
  ctx.saveGState()
  ctx.translateBy(x: logoX, y: logoY)
  ctx.scaleBy(x: logoScale, y: logoScale)
  ctx.addPath(logo)
  ctx.setFillColor(Stop(0, "#FFFFFF").color)
  ctx.drawPath(using: .eoFill)
  ctx.restoreGState()
  let final = context(size)
  final.draw(ctx.makeImage()!, in: CGRect(x: 0, y: 0, width: size, height: size))
  return final.makeImage()!
}
func writePNG(_ image: CGImage, _ url: URL) throws {
  guard
    let dest = CGImageDestinationCreateWithURL(
      url as CFURL, UTType.png.identifier as CFString, 1, nil)
  else { fatalError("Unable to create PNG") }
  CGImageDestinationAddImage(
    dest, image, [kCGImagePropertyProfileName: "sRGB IEC61966-2.1"] as CFDictionary)
  guard CGImageDestinationFinalize(dest) else { fatalError("Unable to save PNG") }
}
let catalogURL = project.appendingPathComponent(
  "ios/Bithold/Images.xcassets/AppIcon.appiconset/Contents.json")
let catalogData = try Data(contentsOf: catalogURL)
let catalog = try JSONSerialization.jsonObject(with: catalogData) as! [String: Any]
let entries = catalog["images"] as! [[String: Any]]
var exports: [String: Int] = [:]
for entry in entries {
  let filename = entry["filename"] as! String
  let points = Double((entry["size"] as! String).split(separator: "x")[0])!
  let scale = Double((entry["scale"] as! String).dropLast())!
  let pixels = Int(points * scale)
  if let previous = exports[filename] { precondition(previous == pixels) }
  exports[filename] = pixels
}
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
for (filename, pixels) in exports.sorted(by: { $0.value < $1.value }) {
  try writePNG(render(pixels), output.appendingPathComponent(filename))
  print("\(filename): \(pixels)×\(pixels), opaque sRGB")
}
let androidSizes = ["mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192]
for (density, pixels) in androidSizes.sorted(by: { $0.value < $1.value }) {
  let directory = project.appendingPathComponent("android/app/src/main/res/mipmap-\(density)")
  try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
  let image = render(pixels)
  for name in ["ic_launcher.png", "ic_launcher_round.png"] {
    try writePNG(image, directory.appendingPathComponent(name))
  }
  print("Android \(density): \(pixels)×\(pixels)")
}
if output.appendingPathComponent("Contents.json") != catalogURL {
  try catalogData.write(to: output.appendingPathComponent("Contents.json"))
}
var defs =
  "<linearGradient id=\"base\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1024\" gradientUnits=\"userSpaceOnUse\">\(background.map(\.svg).joined())</linearGradient>"
var layers = "<rect width=\"1024\" height=\"1024\" fill=\"url(#base)\"/>"
for glow in glows {
  defs +=
    "<radialGradient id=\"\(glow.id)\" cx=\"0\" cy=\"0\" r=\"1\" gradientUnits=\"userSpaceOnUse\" gradientTransform=\"translate(\(glow.x * canvas) \(glow.y * canvas)) rotate(\(glow.rotation)) scale(\(glow.rx * canvas) \(glow.ry * canvas))\">\(glow.stops.map(\.svg).joined())</radialGradient>"
  layers += "<rect width=\"1024\" height=\"1024\" fill=\"url(#\(glow.id))\"/>"
}
let svg = """
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" color-interpolation="sRGB">
    <defs>\(defs)</defs>
    \(layers)
    <path d="\(pathData)" transform="translate(\(logoX) \(logoY)) scale(\(logoScale) \(logoScale))" fill="#FFFFFF" fill-rule="evenodd"/>
  </svg>
  """
try FileManager.default.createDirectory(
  at: master.deletingLastPathComponent(), withIntermediateDirectories: true)
try svg.write(to: master, atomically: true, encoding: .utf8)

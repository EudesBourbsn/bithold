import qrcode from 'qrcode-generator';
import { forwardRef, memo, useEffect, useMemo, useState } from 'react';
import { Image as NativeImage, NativeModules } from 'react-native';
import Svg, { G, Image, Path, Rect } from 'react-native-svg';
import { sheetMetrics } from '../../../theme/sheetMetrics';

const logo = require('../../../../assets/icons/bitcoin-mark.png');
let iconRequest;
function logoData() {
  iconRequest ??= NativeModules.BitholdMedia.imageData(
    NativeImage.resolveAssetSource(logo).uri,
  );
  return iconRequest;
}
export const ReceiveQr = memo(
  forwardRef(function ReceiveQr(
    { address, size, exportMode = false, displaySize = size },
    ref,
  ) {
    const [icon, setIcon] = useState(null);
    useEffect(() => {
      let active = true;
      logoData().then(value => {
        if (active) {
          setIcon(value);
        }
      });
      return () => {
        active = false;
      };
    }, []);
    const matrix = useMemo(() => {
      const qr = qrcode(0, 'H');
      qr.addData(address, 'Byte');
      qr.make();
      return qr;
    }, [address]);
    const count = matrix.getModuleCount(),
      extent = count + 8;
    const cell =
      (exportMode ? displaySize - sheetMetrics.receive.qrPadding * 2 : size) /
      extent;
    const gap = Math.ceil((50 + cell * 0.1) / cell);
    const gapStart = Math.floor(count / 2 - gap / 2),
      gapStop = count - gapStart;
    const finders = [
      [0, 0],
      [count - 7, 0],
      [0, count - 7],
    ];

    const dots = useMemo(() => {
      const corners = [
        [0, 0],
        [count - 7, 0],
        [0, count - 7],
      ];
      let d = '';
      for (let y = 0; y < count; y++) {
        for (let x = 0; x < count; x++) {
          if (
            matrix.isDark(y, x) &&
            !(x >= gapStart && x < gapStop && y >= gapStart && y < gapStop) &&
            !corners.some(
              ([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7,
            )
          ) {
            d += `M${x + 4.04} ${
              y + 4.5
            }a0.46 0.46 0 1 0 0.92 0a0.46 0.46 0 1 0 -0.92 0Z`;
          }
        }
      }
      return d;
    }, [matrix, count, gapStart, gapStop]);
    const canvas = exportMode ? 1024 : size;
    const graphic = exportMode ? 896 : size;
    const offset = exportMode ? 64 : 0;
    const scale = exportMode
      ? 896 / (displaySize - sheetMetrics.receive.qrPadding * 2)
      : 1;
    const tile = 50 * scale,
      logoSize = 40 * scale;
    return (
      <Svg
        ref={ref}
        width={canvas}
        height={canvas}
        viewBox={`0 0 ${canvas} ${canvas}`}
      >
        <Rect width={canvas} height={canvas} fill="white" />
        <G
          transform={`translate(${offset} ${offset}) scale(${
            graphic / extent
          })`}
        >
          <Path d={dots} fill="#181818" />
          {finders.map(([x, y]) => (
            <G key={`${x}:${y}`}>
              <Rect
                x={x + 4.5}
                y={y + 4.5}
                width={6}
                height={6}
                rx={1.5}
                fill="none"
                stroke="#181818"
                strokeWidth={1}
              />
              <Rect
                x={x + 6}
                y={y + 6}
                width={3}
                height={3}
                rx={0.8}
                fill="#181818"
              />
            </G>
          ))}
        </G>
        <Rect
          x={(canvas - tile) / 2}
          y={(canvas - tile) / 2}
          width={tile}
          height={tile}
          rx={8 * scale}
          fill="white"
        />
        {icon && (
          <Image
            href={{ uri: icon }}
            x={(canvas - logoSize) / 2}
            y={(canvas - logoSize) / 2}
            width={logoSize}
            height={logoSize}
          />
        )}
      </Svg>
    );
  }),
);

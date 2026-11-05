import { SvgXml } from 'react-native-svg';
import { DiscIllustration } from '../../backup/components/DiscIllustration';
import { colors } from '../../../theme/colors';

const blueFace = [
  [0, '#D6EDFF'],
  [8, '#A0D0F6'],
  [16, '#8BC2ED'],
  [24, '#71B2E5'],
  [32, '#60A7DF'],
  [48, '#519BD7'],
  [72, '#438FCF'],
  [96, '#3785C9'],
  [128, colors.button],
  [248, '#3C88CA'],
  [272, '#5299D4'],
  [296, '#70ACDE'],
  [320, '#8FC1E9'],
  [336, '#ACD4F2'],
  [344, '#C9E6FB'],
];

const coins = `<!-- Source: https://github.com/tabler/tabler-icons/blob/main/icons/outline/coins.svg
MIT License

Copyright (c) 2020-2026 Paweł Kuna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#FFFFFF"
  stroke-width="1.65"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3" />
  <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4" />
  <path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598" />
  <path d="M3 6v10c0 .888 .772 1.45 2 2" />
  <path d="M3 11c0 .888 .772 1.45 2 2" />
</svg>
`;

export function NetworkFeeIllustration() {
  return (
    <DiscIllustration
      glyph="none"
      faceStops={blueFace}
      rimColor="#8CC5F0"
      edgeColor="rgba(225, 244, 255, 0.6)"
    >
      <SvgXml xml={coins} width={54} height={54} accessible={false} />
    </DiscIllustration>
  );
}

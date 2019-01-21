/**
 * Adapted from Name that Color JavaScript library, written and released by
 * Chirag Mehta at http://chir.ag/projects/ntc/ under the Creative Commons
 *  License 2.5(https://creativecommons.org/licenses/by/2.5/)
 */

import colorNames from './ntc-colors.json';

export const parseHex = hexCode => parseInt('0x' + hexCode) / 255;

// adapted from: Farbtastic 1.2
// http://acko.net/dev/farbtastic
export const hsl = color => {
  const [red, green, blue] = [
    parseHex(color.substring(0, 2)),
    parseHex(color.substring(2, 4)),
    parseHex(color.substring(4, 6))
  ];
  const min = Math.min(red, green, blue);
  const max = Math.max(red, green, blue);
  const delta = max - min;
  const lum = (min + max) / 2;
  const sat =
    lum > 0 && lum < 1 ? delta / (lum < 0.5 ? 2 * lum : 2 - 2 * lum) : 0;

  let hue = 0;
  if (delta > 0) {
    if (max === red && max !== green) hue += (green - blue) / delta;
    if (max === green && max !== blue) hue += 2 + (blue - red) / delta;
    if (max === blue && max !== red) hue += 4 + (red - green) / delta;
    hue /= 6;
  }

  return [parseInt(hue * 255), parseInt(sat * 255), parseInt(lum * 255)];
};

// adapted from: Farbtastic 1.2
// http://acko.net/dev/farbtastic
export const rgb = color => [
  parseInt('0x' + color.substring(0, 2)),
  parseInt('0x' + color.substring(2, 4)),
  parseInt('0x' + color.substring(4, 6))
];

// adapted from: Name that Color
// http://chir.ag/projects/ntc/
export const nameThatColor = color => {
  const exactMatch = colorNames.find(colorName => colorName[0] === color);
  if (exactMatch) return exactMatch[1];

  const [red, green, blue] = rgb(color);
  const [hue, sat, lum] = hsl(color);

  return colorNames.reduce(
    (closestMatch, currentColor) => {
      const rgbDifference =
        Math.pow(red - currentColor[2], 2) +
        Math.pow(green - currentColor[3], 2) +
        Math.pow(blue - currentColor[4], 2);
      const hslDifference =
        Math.pow(hue - currentColor[5], 2) +
        Math.pow(sat - currentColor[6], 2) +
        Math.pow(lum - currentColor[7], 2);
      const difference = rgbDifference + hslDifference * 2;

      if (closestMatch.difference < 0 || closestMatch.difference > difference) {
        return { difference, colorName: currentColor[1] };
      }
      return closestMatch;
    },
    { difference: -1, colorName: null }
  ).colorName;
};

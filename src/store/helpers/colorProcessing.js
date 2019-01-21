import colorConvert from 'color-convert';
import { nameThatColor } from '@/store/helpers/ntc';

export const convertHex = color => {
  const [r, g, b] = colorConvert.hex.rgb(color.hex);
  const [h, s, v] = colorConvert.hex.hsv(color.hex);

  return { ...color, r, g, b, h, s, v };
};

export const convertRgb = color => {
  const hex = colorConvert.rgb.hex(color.r, color.g, color.b);
  const [h, s, v] = colorConvert.rgb.hsv(color.r, color.g, color.b);

  return { ...color, hex, h, s, v };
};

export const convertHsv = color => {
  const hex = colorConvert.hsv.hex(color.h, color.s, color.v);
  const [r, g, b] = colorConvert.hsv.rgb(color.h, color.s, color.v);

  return { ...color, hex, r, g, b };
};

const convertFunction = {
  hex: convertHex,
  rgb: convertRgb,
  hsv: convertHsv
};

export const processColor = (color, newProperties) => {
  const colorProperties = Object.keys(newProperties);
  const hex = colorProperties.includes('hex');
  const rgb = colorProperties.some(colorProperty =>
    ['r', 'g', 'b'].includes(colorProperty)
  );
  const hsv = colorProperties.some(colorProperty =>
    ['h', 's', 'v'].includes(colorProperty)
  );

  if ((hex && colorProperties.length > 1) || (rgb && hsv)) return;

  if (hex) {
    if (!/^#?([0-9A-F]{6})$/i.test(newProperties.hex)) return;
    newProperties.hex = newProperties.hex
      .match(/^#?([0-9A-F]{6})$/i)[1]
      .toUpperCase();
  } else {
    colorProperties.forEach(property => {
      if (property === 'h') {
        if (newProperties.h >= 360) newProperties.h = 0;
        else if (newProperties.h < 0) newProperties.h = 359;
      } else {
        const maxVal = rgb ? 255 : 100;
        if (newProperties[property] > maxVal) newProperties[property] = maxVal;
        else if (newProperties[property] < 0) newProperties[property] = 0;
      }
    });
  }

  const convertFrom = hex ? 'hex' : rgb ? 'rgb' : 'hsv';
  color = { ...color, ...newProperties };

  const newColor = convertFunction[convertFrom](color);

  return { ...newColor, name: nameThatColor(newColor.hex) };
};

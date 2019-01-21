import {
  convertHex,
  convertRgb,
  convertHsv,
  processColor
} from '@/store/helpers/colorProcessing';

describe('colorProcessing', () => {
  it('convertHex converts hexcode to rgb and hsv values', () => {
    const color = { hex: '00ff00' };

    expect(convertHex(color)).toEqual({
      ...color,
      r: 0,
      g: 255,
      b: 0,
      h: 120,
      s: 100,
      v: 100
    });
  });

  it('convertRgb converts rgb values to hexcode and hsv values', () => {
    const color = { r: 0, g: 0, b: 255 };

    expect(convertRgb(color)).toEqual({
      ...color,
      hex: '0000FF',
      h: 240,
      s: 100,
      v: 100
    });
  });

  it('convertHsv converts hsv values to hexcode and rgb values', () => {
    const color = { h: 180, s: 100, v: 100 };

    expect(convertHsv(color)).toEqual({
      ...color,
      hex: '00FFFF',
      r: 0,
      g: 255,
      b: 255
    });
  });

  describe('processColor', () => {
    let newProperties;
    let color;

    beforeEach(() => {
      color = { hex: 'ff0000', r: 255, g: 0, b: 0, h: 0, s: 100, v: 100 };
    });

    it.each(['r', 'g', 'b', 'h', 's', 'v'])(
      'does nothing when passed a hexcode and also passed %s',
      propertyType => {
        newProperties = { hex: '00ff00', [propertyType]: 50 };

        expect(processColor(color, newProperties)).toBeFalsy();
      }
    );

    it.each(['h', 's', 'v'])(
      'does nothing when passed an rgb value and also passed %s',
      propertyType => {
        newProperties = { r: 120, [propertyType]: 50 };

        expect(processColor(color, newProperties)).toBeFalsy();
      }
    );

    it('does nothing when passed a hexcode too short', () => {
      newProperties = { hex: '00000' };

      expect(processColor(color, newProperties)).toBeFalsy();
    });

    it('does nothing when passed a hexcode too long', () => {
      newProperties = { hex: '0000000' };

      expect(processColor(color, newProperties)).toBeFalsy();
    });

    it('does nothing when passed a hexcode with invalid characters', () => {
      newProperties = { hex: 'g0g0g0' };

      expect(processColor(color, newProperties)).toBeFalsy();
    });

    it('returns with an uppercase hex value', () => {
      newProperties = { hex: 'eeeeee' };

      expect(processColor(color, newProperties).hex).toBe(
        newProperties.hex.toUpperCase()
      );
    });

    it('calculates rgb and hsv from hex', () => {
      newProperties = { hex: '00ff00' };

      expect(processColor(color, newProperties)).toHaveProperty('r', 0);
      expect(processColor(color, newProperties)).toHaveProperty('g', 255);
      expect(processColor(color, newProperties)).toHaveProperty('b', 0);
      expect(processColor(color, newProperties)).toHaveProperty('h', 120);
      expect(processColor(color, newProperties)).toHaveProperty('s', 100);
      expect(processColor(color, newProperties)).toHaveProperty('v', 100);
    });

    it('calculates hex and hsv from passed rgb combined with previous', () => {
      color = { r: 0, g: 255, b: 0 };
      newProperties = { b: 255 };

      expect(processColor(color, newProperties)).toHaveProperty(
        'hex',
        '00FFFF'
      );
      expect(processColor(color, newProperties)).toHaveProperty('h', 180);
      expect(processColor(color, newProperties)).toHaveProperty('s', 100);
      expect(processColor(color, newProperties)).toHaveProperty('v', 100);
    });

    it('calculates hex and rgb from passed hsv combined with previous', () => {
      color = { h: 0, s: 100, v: 100 };
      newProperties = { h: 240 };

      expect(processColor(color, newProperties)).toHaveProperty(
        'hex',
        '0000FF'
      );
      expect(processColor(color, newProperties)).toHaveProperty('r', 0);
      expect(processColor(color, newProperties)).toHaveProperty('g', 0);
      expect(processColor(color, newProperties)).toHaveProperty('b', 255);
    });

    it('names the color from hsv', () => {
      color = { h: 0, s: 100, v: 100 };
      newProperties = { h: 240 };

      expect(processColor(color, newProperties).name).toBe('Blue');
    });

    it('names the color from hex', () => {
      newProperties = { hex: 'ff00ff' };

      expect(processColor(color, newProperties).name).toBe('Magenta / Fuchsia');
    });

    it('names the color from rgb', () => {
      newProperties = { r: 255, g: 255, b: 0 };

      expect(processColor(color, newProperties).name).toBe('Yellow');
    });

    it.each([[255, 'r'], [255, 'g'], [255, 'b'], [100, 's'], [100, 'v']])(
      'sets a max value of %d on %s',
      (maxVal, property) => {
        newProperties = { [property]: maxVal + 1 };

        expect(processColor(color, newProperties)[property]).toBe(maxVal);
      }
    );

    it.each(['r', 'g', 'b', 's', 'v'])(
      'sets a min value of 0 on %s',
      property => {
        newProperties = { [property]: -1 };

        expect(processColor(color, newProperties)[property]).toBe(0);
      }
    );

    it('h loops to 0 when greater than 359', () => {
      newProperties = { h: 360 };

      expect(processColor(color, newProperties).h).toBe(0);
    });

    it('h loops to 359 when less than 0', () => {
      newProperties = { h: -1 };

      expect(processColor(color, newProperties).h).toBe(359);
    });
  });
});

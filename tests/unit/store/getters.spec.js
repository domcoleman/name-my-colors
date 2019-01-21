import { getters } from '@/store/getters';

describe('store getters', () => {
  let state;

  beforeEach(() => {
    state = {
      swatches: [
        { name: 'mock1', r: 10 },
        { name: 'mock2', r: 20 },
        { name: 'mock3', r: 30 }
      ],
      activeSwatch: 2
    };
  });

  describe('getSwatchByIndex', () => {
    it('returns the swatch at swatchIndex', () => {
      const swatchIndex = 1;
      const result = getters.swatchByIndex(state)(swatchIndex);

      expect(result).toEqual(state.swatches[swatchIndex]);
    });
  });

  describe('getActiveSwatch', () => {
    it('returns the swatch that is currently active', () => {
      const activeSwatch = (state.activeSwatch = 1);
      const result = getters.activeSwatch(state);

      expect(result).toEqual(state.swatches[activeSwatch]);
    });
  });

  describe('getActiveSwatchProperty', () => {
    it('returns the requested property of the active swatch', () => {
      const activeSwatch = (state.activeSwatch = 1);
      const swatchProperty = 'r';
      const result = getters.activeSwatchProperty(state)(swatchProperty);

      expect(result).toEqual(state.swatches[activeSwatch][swatchProperty]);
    });
  });
});

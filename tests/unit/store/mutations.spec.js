import { mutations } from '@/store/mutations';

describe('store mutations', () => {
  let state;

  beforeEach(() => {
    state = {
      swatches: ['mock 1', 'mock 2', 'mock 3', 'mock 4'],
      activeSwatch: 0
    };
  });

  it('ADD_SWATCH pushes color to swatches', () => {
    const mockColor = 'mock color';

    mutations.ADD_SWATCH(state, { color: mockColor });
    expect(state.swatches).toContain(mockColor);
  });

  it('UPDATE_SWATCH sets the swatch at swatchIndex to color', () => {
    const mockColor = 'mock color';
    const swatchIndex = 1;

    mutations.UPDATE_SWATCH(state, { swatchIndex, color: mockColor });
    expect(state.swatches[swatchIndex]).toEqual(mockColor);
  });

  it('DESTROY_SWATCH removes the swatch at swatchIndex', () => {
    const swatchIndex = 2;

    mutations.DESTROY_SWATCH(state, { swatchIndex });
    expect(state.swatches).toEqual(['mock 1', 'mock 2', 'mock 4']);
  });

  it('DESTROY_ALL_SWATCHES removes all swatches', () => {
    mutations.DESTROY_ALL_SWATCHES(state);
    expect(state.swatches).toEqual([]);
  });

  it('SET_ACTIVE_SWATCH sets activeSwatch to swatchIndex', () => {
    const swatchIndex = 2;

    mutations.SET_ACTIVE_SWATCH(state, { swatchIndex });
    expect(state.activeSwatch).toBe(swatchIndex);
  });
});

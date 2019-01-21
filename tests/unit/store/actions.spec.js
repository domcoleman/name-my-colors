import { actions } from '@/store/actions';

describe('store actions', () => {
  let commit;
  let state;
  let color;

  beforeEach(() => {
    commit = jest.fn();
    state = { swatches: ['mock1', 'mock2', 'mock3'], activeSwatch: 0 };
  });

  describe('createColorSwatch', () => {
    it('commits ADD_SWATCH with default params when color is empty', () => {
      actions.createColorSwatch({ commit, state });

      expect(commit).toHaveBeenCalledWith('ADD_SWATCH', {
        color: {
          r: 0,
          g: 0,
          b: 0,
          h: 0,
          s: 0,
          v: 0,
          hex: '000000',
          name: 'Black'
        }
      });
    });

    it('commits ADD_SWATCH with params determined by passed hex', () => {
      const hex = '#FF00FF';
      actions.createColorSwatch({ commit, state }, { colorValue: hex });

      expect(commit).toHaveBeenCalledWith('ADD_SWATCH', {
        color: {
          r: 255,
          g: 0,
          b: 255,
          h: 300,
          s: 100,
          v: 100,
          hex: 'FF00FF',
          name: 'Magenta / Fuchsia'
        }
      });
    });

    it('commits SET_ACTIVE_SWATCH when setActive is true', () => {
      actions.createColorSwatch({ commit, state }, { setActive: true });

      expect(commit).toHaveBeenCalledWith('SET_ACTIVE_SWATCH', {
        swatchIndex: 3
      });
    });

    it('does not commit SET_ACTIVE_SWATCH when setActive is false', () => {
      actions.createColorSwatch({ commit, state }, { setActive: false });

      expect(commit).not.toHaveBeenCalledWith('SET_ACTIVE_SWATCH');
    });
  });

  describe('importColorSwatches', () => {
    let colorValues;
    beforeEach(() => (colorValues = ['FF00FF', 'FFFF00', 'FFFFFF']));

    it('does nothing when no colors are entered', async () => {
      colorValues = [];
      await actions.importColorSwatches({ commit }, { clearPrevious: true });

      expect(commit).not.toHaveBeenCalled();
    });

    it('calls DESTROY_ALL_SWATCHES when clearPrevious is true', async () => {
      await actions.importColorSwatches(
        { commit },
        { colorValues, clearPrevious: true }
      );
      expect(commit).toHaveBeenCalledWith('DESTROY_ALL_SWATCHES');
    });

    it('does not call DESTROY_ALL_SWATCHES when clearPrevious is false', async () => {
      await actions.importColorSwatches(
        { commit },
        { colorValues, clearPrevious: false }
      );
      expect(commit).not.toHaveBeenCalledWith('DESTROY_ALL_SWATCHES');
    });

    it('calls SET_ACTIVE_SWATCH when clearPrevious is true', async () => {
      await actions.importColorSwatches(
        { commit },
        { colorValues, clearPrevious: true }
      );
      expect(commit).toHaveBeenCalledWith('SET_ACTIVE_SWATCH', {
        swatchIndex: 0
      });
    });

    it('does not call SET_ACTIVE_SWATCH when clearPrevious is false', async () => {
      await actions.importColorSwatches(
        { commit },
        { colorValues, clearPrevious: true }
      );
      expect(commit).not.toHaveBeenCalledWith('SET_ACTIVE_SWATCH');
    });

    it('calls ADD_SWATCH on each of colorValues', async () => {
      // const colorValues = ['FF00FF', 'FFFF00', 'FFFFFF'];
      await actions.importColorSwatches({ commit }, { colorValues });

      expect(commit.mock.calls[0][1].color.hex).toBe(colorValues[0]);
      expect(commit.mock.calls[1][1].color.hex).toBe(colorValues[1]);
      expect(commit.mock.calls[2][1].color.hex).toBe(colorValues[2]);
    });
  });

  describe('updateColorSwatch', () => {
    beforeEach(() => {
      color = {
        r: 0,
        g: 0,
        b: 0,
        h: 0,
        s: 0,
        v: 0,
        hex: '000000',
        name: 'Black'
      };
      state = {
        swatches: [color],
        activeSwatch: 0
      };
    });

    it('throws an error when colorProperties has no real properties', () => {
      const colorProperties = { p: 255 };
      const action = () =>
        actions.updateColorSwatch({ commit, state }, { colorProperties });

      expect(action).toThrowError('No valid properties');
      expect(commit).not.toHaveBeenCalled();
    });

    it('throws an error when passed multiple color modes', () => {
      const colorProperties = { h: 300, r: 40 };
      const action = () =>
        actions.updateColorSwatch({ commit, state }, { colorProperties });

      expect(action).toThrowError('Cannot mix multiple color models');
      expect(commit).not.toHaveBeenCalled();
    });

    it('commits UPDATE_SWATCH with activeSwatch when passed valid params', () => {
      const colorProperties = { s: 50, v: 50 };
      actions.updateColorSwatch({ commit, state }, { colorProperties });

      expect(commit).toHaveBeenCalledWith('UPDATE_SWATCH', {
        swatchIndex: state.activeSwatch,
        color: {
          r: 128,
          g: 64,
          b: 64,
          h: 0,
          s: 50,
          v: 50,
          hex: '804040',
          name: 'Lotus'
        }
      });
    });
  });

  describe('setActiveSwatch', () => {
    it('throws an error when swatchIndex does not exist', () => {
      const swatchIndex = 3;
      const action = () =>
        actions.setActiveSwatch({ commit, state }, { swatchIndex });

      expect(action).toThrowError('Swatch does not exist');
      expect(commit).not.toHaveBeenCalled();
    });

    it('commits nothing if swatchIndex is already activeSwatch', () => {
      const swatchIndex = 0;
      actions.setActiveSwatch({ commit, state }, { swatchIndex });

      expect(commit).not.toHaveBeenCalled();
    });

    it('commits SET_ACTIVE_SWATCH with swatchIndex', () => {
      const swatchIndex = 1;
      actions.setActiveSwatch({ commit, state }, { swatchIndex });

      expect(commit).toHaveBeenCalledWith('SET_ACTIVE_SWATCH', { swatchIndex });
    });
  });

  describe('removeColorSwatch', () => {
    it('throws an error if swatchIndex does not exist', () => {
      const swatchIndex = 3;
      const action = () =>
        actions.removeColorSwatch({ commit, state }, { swatchIndex });

      expect(action).toThrowError('Swatch does not exist');
      expect(commit).not.toHaveBeenCalled();
    });

    it('throws an error if swatch is last of swatches', () => {
      const swatchIndex = 0;
      state.swatches = ['mock1'];
      const action = () =>
        actions.removeColorSwatch({ commit, state }, { swatchIndex });

      expect(action).toThrowError('Cannot delete last swatch');
      expect(commit).not.toHaveBeenCalled();
    });

    it('commits DESTROY_SWATCH with swatchIndex if it exists', () => {
      const swatchIndex = 1;
      actions.removeColorSwatch({ commit, state }, { swatchIndex });

      expect(commit).toHaveBeenCalledWith('DESTROY_SWATCH', {
        swatchIndex
      });
    });

    it('commits SET_ACTIVE_SWATCH when activeSwatch is equal to swatchIndex', () => {
      const swatchIndex = 1;
      state.activeSwatch = 1;
      actions.removeColorSwatch({ commit, state }, { swatchIndex });

      expect(commit).toHaveBeenCalledWith('SET_ACTIVE_SWATCH', {
        swatchIndex: state.activeSwatch - 1
      });
    });

    it('commits SET_ACTIVE_SWATCH when activeSwatch is greater than swatchIndex', () => {
      const swatchIndex = 1;
      state.activeSwatch = 2;
      actions.removeColorSwatch({ commit, state }, { swatchIndex });

      expect(commit).toHaveBeenCalledWith('SET_ACTIVE_SWATCH', {
        swatchIndex: state.activeSwatch - 1
      });
    });

    it('does not commit SET_ACTIVE_SWATCH when activeSwatch is 0', () => {
      const swatchIndex = 1;
      state.activeSwatch = 0;
      actions.removeColorSwatch({ commit, state }, { swatchIndex });

      expect(commit).not.toHaveBeenCalledWith('SET_ACTIVE_SWATCH');
    });

    it('does not commit SET_ACTIVE_SWATCH when activeSwatch is less than swatchIndex', () => {
      const swatchIndex = 2;
      state.activeSwatch = 1;
      actions.removeColorSwatch({ commit, state }, { swatchIndex });

      expect(commit).not.toHaveBeenCalledWith('SET_ACTIVE_SWATCH');
    });
  });
});

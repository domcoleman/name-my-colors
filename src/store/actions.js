import { processColor } from '@/store/helpers/colorProcessing';

export const actions = {
  createColorSwatch(
    { commit, state },
    { colorValue, setActive } = {
      colorValue: null,
      setActive: false
    }
  ) {
    const color = processColor(
      {},
      { hex: /^#?([0-9A-F]{6})$/i.test(colorValue) ? colorValue : '000000' }
    );

    if (setActive) {
      commit('SET_ACTIVE_SWATCH', { swatchIndex: state.swatches.length });
    }
    commit('ADD_SWATCH', { color });
  },
  async importColorSwatches(
    { commit },
    { colorValues, clearPrevious } = { colorValues: [], clearPrevious: false }
  ) {
    if (!colorValues || colorValues.length < 1) {
      return;
    }

    if (clearPrevious) commit('DESTROY_ALL_SWATCHES');

    for (let hex of colorValues) {
      await commit('ADD_SWATCH', { color: processColor({}, { hex }) });
    }

    return clearPrevious
      ? commit('SET_ACTIVE_SWATCH', { swatchIndex: 0 })
      : Promise.resolve();
  },
  updateColorSwatch({ commit, state }, { colorProperties }) {
    const swatchIndex = state.activeSwatch;
    const color = state.swatches.slice(swatchIndex, swatchIndex + 1)[0];

    const hasValidProperties = Object.keys(colorProperties).some(property =>
      color.hasOwnProperty(property)
    );

    if (!hasValidProperties) throw new Error('No valid properties');

    const newColor = processColor(color, colorProperties);

    if (!newColor) throw new Error('Cannot mix multiple color models');

    commit('UPDATE_SWATCH', { swatchIndex, color: newColor });
  },
  setActiveSwatch({ commit, state }, { swatchIndex }) {
    if (!state.swatches[swatchIndex]) throw new Error('Swatch does not exist');

    if (state.activeSwatch !== swatchIndex)
      commit('SET_ACTIVE_SWATCH', { swatchIndex });
  },
  removeColorSwatch({ commit, state }, { swatchIndex }) {
    if (!state.swatches[swatchIndex]) throw new Error('Swatch does not exist');
    if (state.swatches.length === 1) {
      throw new Error('Cannot delete last swatch');
    }

    if (state.activeSwatch >= swatchIndex && state.activeSwatch > 0) {
      commit('SET_ACTIVE_SWATCH', { swatchIndex: state.activeSwatch - 1 });
    }

    commit('DESTROY_SWATCH', { swatchIndex });
  }
};

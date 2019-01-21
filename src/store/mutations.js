export const mutations = {
  ADD_SWATCH(state, { color }) {
    state.swatches.push(color);
  },
  UPDATE_SWATCH(state, { swatchIndex, color }) {
    state.swatches.splice(swatchIndex, 1, color);
  },
  DESTROY_SWATCH(state, { swatchIndex }) {
    state.swatches.splice(swatchIndex, 1);
  },
  DESTROY_ALL_SWATCHES(state) {
    state.swatches = [];
  },
  SET_ACTIVE_SWATCH(state, { swatchIndex }) {
    state.activeSwatch = swatchIndex;
  }
};

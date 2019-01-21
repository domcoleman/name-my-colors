export const getters = {
  swatchByIndex: state => swatchIndex => state.swatches[swatchIndex],
  activeSwatch: state => state.swatches[state.activeSwatch],
  activeSwatchProperty: state => swatchProperty =>
    state.swatches[state.activeSwatch][swatchProperty]
};

import HexPicker from '@/components/CurrentSwatch/HexPicker';
import { getters } from '@/store/getters';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('HexPicker.vue', () => {
  let actions;
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    actions = {
      updateColorSwatch: jest.fn()
    };
    state = {
      swatches: [
        { name: 'Swatch 1', hex: '000000' },
        { name: 'Swatch 2', hex: 'ff0000' },
        { name: 'Swatch 3', hex: '00ff00' },
        { name: 'Swatch 4', hex: '0000ff' }
      ],
      activeSwatch: 2
    };
    store = new Vuex.Store({ state, actions, getters });
    wrapper = shallowMount(HexPicker, { store, localVue });
  });

  it('renders an input with the correct hex value', () => {
    const activeSwatch = state.swatches[state.activeSwatch];

    expect(wrapper.element.value).toBe(`#${activeSwatch.hex}`);
  });

  it('does not call updateColorSwatch when hex code is too short', () => {
    const hexCode = '01ff';
    wrapper.setValue(hexCode);

    expect(actions.updateColorSwatch).not.toHaveBeenCalled();
  });

  it('does not call updateColorSwatch when hex code has invalid characters', () => {
    const hexCode = '01fg00';
    wrapper.setValue(hexCode);

    expect(actions.updateColorSwatch).not.toHaveBeenCalled();
  });

  it('calls updateColorSwatch when a hex code is input without a hash', () => {
    const hexCode = '01ff04';
    wrapper.setValue(hexCode);

    expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
      colorProperties: { hex: hexCode }
    });
  });

  it('calls updateColorSwatch when a hex code is input with a hash', () => {
    const hexCode = '#01ff04';
    wrapper.setValue(hexCode);

    expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
      colorProperties: { hex: hexCode }
    });
  });
});

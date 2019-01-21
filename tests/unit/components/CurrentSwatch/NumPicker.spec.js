import NumPicker from '@/components/CurrentSwatch/NumPicker';
import { getters } from '@/store/getters';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('NumPicker.vue', () => {
  let actions;
  let state;
  let store;
  let propsData;
  let wrapper;

  beforeEach(() => {
    actions = {
      updateColorSwatch: jest.fn()
    };
    state = {
      swatches: [
        { r: 100, g: 112, b: 220, h: 234, s: 55, v: 86 },
        { r: 255, g: 200, b: 185, h: 13, s: 27, v: 100 },
        { r: 118, g: 255, b: 111, h: 116, s: 57, v: 100 },
        { r: 106, g: 200, b: 255, h: 202, s: 58, v: 100 }
      ],
      activeSwatch: 1
    };
    store = new Vuex.Store({ state, actions, getters });
    propsData = {
      colorProperty: 'r'
    };
    wrapper = shallowMount(NumPicker, { propsData, store, localVue });
  });

  it('renders a label with the colorProperty in uppercase', () => {
    const labelTag = wrapper.find({ ref: 'numberPickerLabel' });

    expect(labelTag.text()).toContain(propsData.colorProperty.toUpperCase());
  });

  it('renders an input with the value of colorProperty', () => {
    const activeSwatch = state.swatches[state.activeSwatch];
    const inputTag = wrapper.find({ ref: 'numberPickerInput' });

    expect(+inputTag.element.value).toBe(activeSwatch[propsData.colorProperty]);
  });

  describe.each([
    ['r', '0', '255'],
    ['g', '0', '255'],
    ['b', '0', '255'],
    ['h', '-1', '360'],
    ['s', '0', '100'],
    ['v', '0', '100']
  ])('when colorProperty is %s', (colorProperty, minExpected, maxExpected) => {
    beforeEach(() => wrapper.setProps({ colorProperty }));

    it(`renders an input with a min value of ${minExpected}`, () => {
      const inputTag = wrapper.find({ ref: 'numberPickerInput' });

      expect(inputTag.attributes('min')).toBe(minExpected);
    });

    it(`renders an input with a max value of ${maxExpected}`, () => {
      const inputTag = wrapper.find({ ref: 'numberPickerInput' });

      expect(inputTag.attributes('max')).toBe(maxExpected);
    });
  });

  it('calls updateColorSwatch with colorProperty when input value is changed', () => {
    const colorValue = 200;
    const inputTag = wrapper.find({ ref: 'numberPickerInput' });
    inputTag.setValue(colorValue);

    expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
      colorProperties: { [propsData.colorProperty]: colorValue }
    });
  });
});

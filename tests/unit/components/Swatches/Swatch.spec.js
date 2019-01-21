import Swatch from '@/components/Swatches/Swatch';
import { getters } from '@/store/getters';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('SwatchPicker.Swatch.vue', () => {
  let actions;
  let state;
  let store;
  let propsData;
  let wrapper;

  beforeEach(() => {
    actions = {
      setActiveSwatch: jest.fn()
    };
    state = {
      swatches: [
        { hex: '000000', r: 0, g: 0, b: 0, name: 'Black' },
        { hex: 'FF0000', r: 255, g: 0, b: 0, name: 'Red' }
      ],
      activeSwatch: 0
    };
    store = new Vuex.Store({ state, actions, getters });
    propsData = {
      swatchIndex: 1
    };
    wrapper = shallowMount(Swatch, { propsData, store, localVue });
  });

  it('has a title of the name and hex properties', () => {
    const swatchTag = wrapper.find({ ref: 'swatchAnchor' });
    const swatch = state.swatches[propsData.swatchIndex];

    expect(swatchTag.attributes('title')).toContain(swatch.name);
    expect(swatchTag.attributes('title')).toContain(swatch.hex);
  });

  it('has a background color of the swatch values', () => {
    const swatchTag = wrapper.find({ ref: 'swatchAnchor' });
    const swatch = state.swatches[propsData.swatchIndex];

    expect(swatchTag.element.style.backgroundColor).toBe(
      `rgb(${swatch.r}, ${swatch.g}, ${swatch.b})`
    );
  });

  it('has the active property when currently active', () => {
    store.state.activeSwatch = propsData.swatchIndex;
    const swatchTag = wrapper.find({ ref: 'swatchAnchor' });

    expect(swatchTag.attributes('data-active')).toBeTruthy();
  });

  it('has no active property when not currently active', () => {
    const swatchTag = wrapper.find({ ref: 'swatchAnchor' });

    expect(swatchTag.attributes('data-active')).toBeFalsy();
  });

  it('is set as the activeSwatch when clicked', () => {
    const swatchTag = wrapper.find({ ref: 'swatchAnchor' });
    swatchTag.trigger('click');

    expect(actions.setActiveSwatch.mock.calls[0][1]).toEqual({
      swatchIndex: propsData.swatchIndex
    });
  });

  it('sets dataTransfer text to swatchIndex when being dragged', () => {
    const swatchTag = wrapper.find({ ref: 'swatchAnchor' });
    const setData = jest.fn();
    swatchTag.trigger('dragstart', { dataTransfer: { setData } });

    expect(setData).toHaveBeenCalledWith('text', propsData.swatchIndex);
  });

  it('clears dataTransfer text when stopped dragging', () => {
    const swatchTag = wrapper.find({ ref: 'swatchAnchor' });
    const clearData = jest.fn();
    swatchTag.trigger('dragend', { dataTransfer: { clearData } });

    expect(clearData).toHaveBeenCalledWith('text');
  });
});

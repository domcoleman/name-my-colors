import Swatches from '@/components/Swatches';
import getters from '@/store/getters';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Swatch.vue', () => {
  let actions;
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    actions = {
      createColorSwatch: jest.fn(),
      removeColorSwatch: jest.fn()
    };
    state = {
      swatches: [
        { name: 'Swatch 1', hex: '000000' },
        { name: 'Swatch 2', hex: 'ff0000' },
        { name: 'Swatch 3', hex: '00ff00' },
        { name: 'Swatch 4', hex: '0000ff' }
      ],
      activeSwatch: 0
    };
    store = new Vuex.Store({ state, actions, getters });
    wrapper = shallowMount(Swatches, { store, localVue });
  });

  it('renders a swatch for each of the swatches in the store state', () => {
    const swatchTags = wrapper.findAll('swatch-stub');

    expect(swatchTags.length).toBe(state.swatches.length);
  });

  it('calls createColorSwatch with no hex when new button is clicked', () => {
    const newSwatch = wrapper.find({ ref: 'newSwatch' });
    newSwatch.trigger('click');

    expect(actions.createColorSwatch.mock.calls[0][1]).toEqual({
      colorValue: null,
      setActive: true
    });
  });

  it("calls createColorSwatch with the dragged swatch's hex when new button is dropped onto", () => {
    const swatchIndex = 2;
    const newSwatch = wrapper.find({ ref: 'newSwatch' });
    const getData = jest.fn(() => swatchIndex);
    newSwatch.trigger('drop', { dataTransfer: { getData } });

    expect(getData).toHaveBeenCalledWith('text');
    expect(actions.createColorSwatch.mock.calls[0][1]).toEqual({
      colorValue: state.swatches[swatchIndex].hex,
      setActive: true
    });
  });

  it('calls removeColorSwatch with the current active swatch when delete button is clicked', () => {
    const swatchIndex = (state.activeSwatch = 3);
    const deleteSwatch = wrapper.find({ ref: 'deleteSwatch' });
    deleteSwatch.trigger('click');

    expect(actions.removeColorSwatch.mock.calls[0][1]).toEqual({ swatchIndex });
  });

  it("calls removeColorSwatch with the dragged swatch's index when delete button is dropped onto", () => {
    const swatchIndex = 2;
    const deleteSwatch = wrapper.find({ ref: 'deleteSwatch' });
    const getData = jest.fn(() => swatchIndex);
    deleteSwatch.trigger('drop', { dataTransfer: { getData } });

    expect(getData).toHaveBeenCalledWith('text');
    expect(actions.removeColorSwatch.mock.calls[0][1]).toEqual({ swatchIndex });
  });
});

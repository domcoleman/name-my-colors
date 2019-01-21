import SatValPicker from '@/components/CurrentSwatch/SatValPicker';
import { getters } from '@/store/getters';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('SatValPicker.vue', () => {
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
        { name: 'Swatch 1', s: 20, v: 30 },
        { name: 'Swatch 2', s: 40, v: 50 },
        { name: 'Swatch 3', s: 10, v: 90 }
      ],
      activeSwatch: 2
    };
    store = new Vuex.Store({ state, actions, getters });
    wrapper = shallowMount(SatValPicker, {
      store,
      localVue,
      attachToDocument: true
    });
  });

  it('renders the position dropper at the correct position within the wrapper', () => {
    const swatch = state.swatches[state.activeSwatch];
    const positionTag = wrapper.find({ ref: 'positionDropper' });

    expect(positionTag.element.style.top).toBe(100 - swatch.v + '%');
  });

  it('calls updateColorSwatch with saturation and value determined by wrapper click position', () => {
    const testRect = { top: 10, height: 100, left: 20, width: 100 };
    const event = { testRect, clientY: 50, clientX: 40 };
    wrapper.trigger('click', event);

    expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
      colorProperties: { s: 20, v: 60 }
    });
  });

  describe('when mousedown on wrapper', () => {
    const testRect = { top: 10, height: 100, left: 20, width: 100 };

    it('calls updateColorSwatch with saturation and value determined by mouse position', () => {
      const event = { testRect, clientY: 14, clientX: 34 };
      wrapper.trigger('mousedown');

      expect(actions.updateColorSwatch).not.toHaveBeenCalled();

      wrapper.trigger('mousemove', event);

      expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
        colorProperties: { s: 14, v: 96 }
      });
    });

    it('calls updateColorSwatch with min saturation when mouse moves left of wrapper', () => {
      const event = { testRect, clientX: 1, clientY: 40 };
      wrapper.trigger('mousedown');
      wrapper.trigger('mousemove', event);

      expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
        colorProperties: { s: 0, v: 70 }
      });
    });

    it('calls updateColorSwatch with max saturation when mouse moves right of wrapper', () => {
      const event = { testRect, clientX: 201, clientY: 40 };
      wrapper.trigger('mousedown');
      wrapper.trigger('mousemove', event);

      expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
        colorProperties: { s: 100, v: 70 }
      });
    });

    it('calls updateColorSwatch with min value when mouse moves below wrapper', () => {
      const event = { testRect, clientX: 40, clientY: 205 };
      wrapper.trigger('mousedown');
      wrapper.trigger('mousemove', event);

      expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
        colorProperties: { s: 20, v: 0 }
      });
    });

    it('calls updateColorSwatch with max value when mouse moves above wrapper', () => {
      const event = { testRect, clientX: 40, clientY: 4 };
      wrapper.trigger('mousedown');
      wrapper.trigger('mousemove', event);

      expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
        colorProperties: { s: 20, v: 100 }
      });
    });

    it('stops listening for mouse movement when mouse is up', () => {
      const event = { testRect, clientX: 50, clientY: 200 };
      wrapper.trigger('mousedown');
      wrapper.trigger('mouseup');
      wrapper.trigger('mousemove', event);

      expect(actions.updateColorSwatch).not.toHaveBeenCalled();
    });
  });
});

import HuePicker from '@/components/CurrentSwatch/HuePicker';
import { getters } from '@/store/getters';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('HuePicker.vue', () => {
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
        { name: 'Swatch 1', h: 160 },
        { name: 'Swatch 2', h: 120 },
        { name: 'Swatch 3', h: 300 }
      ],
      activeSwatch: 2
    };
    store = new Vuex.Store({ state, actions, getters });
    wrapper = shallowMount(HuePicker, {
      store,
      localVue,
      attachToDocument: true
    });
  });

  it('renders the position bar at the correct position along the slider', () => {
    const positionTag = wrapper.find({ ref: 'positionBar' });

    expect(positionTag.element.style.top).toBe('83%');
  });

  it('calls updateColorSwatch with hue value determined by slider click position', () => {
    const testRect = { top: 10, height: 180 };
    const event = { testRect, clientY: 130 };
    wrapper.trigger('click', event);

    expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
      colorProperties: { h: 240 }
    });
  });

  describe('when mousedown on bar', () => {
    const testRect = { top: 10, height: 180 };

    it('calls updateColorSwatch with hue value determined by mouse position', () => {
      const event = { testRect, clientY: 130 };
      wrapper.trigger('mousedown');

      expect(actions.updateColorSwatch).not.toHaveBeenCalled();

      wrapper.trigger('mousemove', event);

      expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
        colorProperties: { h: 240 }
      });
    });

    it('calls updateColorSwatch with min hue value when mouse moves above bar', () => {
      const event = { testRect, clientY: 1 };
      wrapper.trigger('mousedown');
      wrapper.trigger('mousemove', event);

      expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
        colorProperties: { h: 0 }
      });
    });

    it('calls updateColorSwatch with max hue value when mouse moves below bar', () => {
      const event = { testRect, clientY: 200 };
      wrapper.trigger('mousedown');
      wrapper.trigger('mousemove', event);

      expect(actions.updateColorSwatch.mock.calls[0][1]).toEqual({
        colorProperties: { h: 359 }
      });
    });

    it('stops listening for mouse movement when mouse is up', () => {
      const event = { testRect, clientY: 200 };
      wrapper.trigger('mousedown');
      wrapper.trigger('mouseup');
      wrapper.trigger('mousemove', event);

      expect(actions.updateColorSwatch).not.toHaveBeenCalled();
    });
  });
});

import CurrentSwatch from '@/components/CurrentSwatch';
import { getters } from '@/store/getters';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('CurrentSwatch.vue', () => {
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    state = {
      swatches: [
        { r: 0, g: 0, b: 0, name: 'Black' },
        { r: 255, g: 0, b: 0, name: 'Red' }
      ],
      activeSwatch: 1
    };
    store = new Vuex.Store({ state, getters });
    wrapper = shallowMount(CurrentSwatch, { store, localVue });
  });

  it('renders the color name', () => {
    const activeSwatch = state.swatches[state.activeSwatch];
    const nameTag = wrapper.find({ ref: 'colorName' });

    expect(nameTag.text()).toBe(activeSwatch.name);
  });

  it('renders the correct color in the preview box', () => {
    const activeSwatch = state.swatches[state.activeSwatch];
    const previewTag = wrapper.find({ ref: 'colorPreview' });

    expect(previewTag.element.style.backgroundColor).toBe(
      `rgb(${activeSwatch.r}, ${activeSwatch.g}, ${activeSwatch.b})`
    );
  });

  it('renders a HexPicker component', () => {
    const componentTag = wrapper.find('hexpicker-stub');

    expect(componentTag.exists()).toBe(true);
  });

  it.each(['r', 'g', 'b', 'h', 's', 'v'])(
    'renders a NumPicker component for %s',
    property => {
      const componentTag = wrapper.find(
        `numpicker-stub[colorproperty=${property}]`
      );

      expect(componentTag.exists()).toBe(true);
    }
  );

  xit('renders a HuePicker component', () => {
    const componentTag = wrapper.find('huepicker-stub');

    expect(componentTag.exists()).toBe(true);
  });

  xit('renders a SatValPicker component', () => {
    const componentTag = wrapper.find('satvalpicker-stub');

    expect(componentTag.exists()).toBe(true);
  });
});

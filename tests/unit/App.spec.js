import App from '@/App';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('App.vue', () => {
  let actions;
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    actions = {
      createColorSwatch: jest.fn()
    };
    state = {
      swatches: [],
      activeSwatch: 0
    };
    store = new Vuex.Store({ state, actions });
    wrapper = shallowMount(App, {
      store,
      localVue
    });
  });

  it('calls createColorSwatch when created', () => {
    expect(actions.createColorSwatch).toHaveBeenCalled();
  });

  it('renders a NavigationLinks component', () => {
    expect(wrapper.find('navigationlinks-stub').exists()).toBe(true);
  });

  it('renders a component of the current view', () => {
    const currentView = wrapper.find({ ref: 'currentView' });

    expect(currentView.name()).toBe(wrapper.vm.currentView);
  });

  describe.each(['currentView', 'navigationLinks'])(
    'receiving showView event from %s',
    componentRef => {
      it('does nothing if the view does not exist', () => {
        const component = wrapper.find({ ref: componentRef });
        component.vm.$emit('showView', 'Mock');

        const currentView = wrapper.find({ ref: 'currentView' });
        expect(currentView.name()).toBe('Colors');
      });

      it('switches to the view when it exists', () => {
        const component = wrapper.find({ ref: componentRef });
        component.vm.$emit('showView', 'About');

        const currentView = wrapper.find({ ref: 'currentView' });
        expect(currentView.name()).toBe('About');
      });
    }
  );
});

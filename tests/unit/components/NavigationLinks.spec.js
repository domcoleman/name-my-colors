import NavigationLinks from '@/components/NavigationLinks';
import { shallowMount } from '@vue/test-utils';

describe('NavigationLinks.vue', () => {
  let propsData;
  let wrapper;

  beforeEach(() => {
    propsData = {
      views: ['Mock 1', 'Mock 2', 'Mock 3'],
      currentView: 'Mock 2'
    };
    wrapper = shallowMount(NavigationLinks, { propsData });
  });

  it('displays a link for each of views', () => {
    const viewLinks = wrapper.findAll({ ref: 'viewLink' });

    expect(viewLinks.length).toBe(propsData.views.length);
  });

  it('link to current view has active state', () => {
    const viewLink = wrapper.findAll({ ref: 'viewLink' }).at(1);

    expect(viewLink.attributes('data-active')).toBeTruthy();
  });

  it('link to non-current views have no active state', () => {
    const viewLink = wrapper.findAll({ ref: 'viewLink' }).at(0);

    expect(viewLink.attributes('data-active')).toBeFalsy();
  });

  it('emits showView when clicking a link', () => {
    const viewLink = wrapper.find({ ref: 'viewLink' });
    viewLink.trigger('click');

    expect(wrapper.emitted('showView')[0]).toEqual([propsData.views[0]]);
  });

  it('emits nothing when clicking a link for the current view', () => {
    const viewLink = wrapper.findAll({ ref: 'viewLink' }).at(1);
    viewLink.trigger('click');

    expect(wrapper.emitted('showView')).toBeFalsy();
  });
});

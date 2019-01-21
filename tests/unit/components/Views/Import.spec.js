import Import from '@/components/Views/Import';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import flushPromises from 'flush-promises';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Import.vue', () => {
  let actions;
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    actions = {
      importColorSwatches: jest.fn()
    };
    state = {
      swatches: [
        { r: 0, g: 0, b: 0, name: 'Black' },
        { r: 255, g: 0, b: 0, name: 'Red' }
      ],
      activeSwatch: 1
    };
    store = new Vuex.Store({ state, actions });
    wrapper = shallowMount(Import, { store, localVue });
  });

  it('submitting with no hex codes within importData alerts the user', async () => {
    const importData = wrapper.find({ ref: 'importData' });
    const submit = wrapper.find({ ref: 'submitImport' });
    importData.setValue('mock fake hex code');
    submit.trigger('click');
    await flushPromises();

    expect(importData.element.value).toContain('No hex codes added');
  });

  it('submitting with no hex codes within importData does not call importColorSwatches', async () => {
    const importData = wrapper.find({ ref: 'importData' });
    const submit = wrapper.find({ ref: 'submitImport' });
    importData.setValue('mock fake hex code');
    submit.trigger('click');
    await flushPromises();

    expect(actions.importColorSwatches).not.toHaveBeenCalled();
  });

  it('submitting calls importColorSwatches with each valid hexcode', async () => {
    const setValueTo = `#000 #ff dfd 9898bb\n#afafee #66gg66 #cdcd #999 cd81ba`;
    const expectReturn = '000000 DDFFDD 9898BB AFAFEE 999999 CD81BA'.split(' ');

    const importData = wrapper.find({ ref: 'importData' });
    const submit = wrapper.find({ ref: 'submitImport' });
    importData.setValue(setValueTo);
    submit.trigger('click');
    await flushPromises();

    expect(actions.importColorSwatches.mock.calls[0][1].colorValues).toEqual(
      expectReturn
    );
  });

  it('submitting calls importColorSwatches with clearPrevious when clearOriginalData is checked', async () => {
    wrapper.setData({ importData: '#000' });
    const clearOriginalData = wrapper.find({ ref: 'clearOriginalData' });
    const submit = wrapper.find({ ref: 'submitImport' });
    clearOriginalData.setChecked();
    submit.trigger('click');
    await flushPromises();

    expect(actions.importColorSwatches.mock.calls[0][1].clearPrevious).toBe(
      true
    );
  });

  it('submitting calls importColorSwatches without clearPrevious when clearOriginalData is not checked', async () => {
    wrapper.setData({ importData: '#000' });
    const clearOriginalData = wrapper.find({ ref: 'clearOriginalData' });
    const submit = wrapper.find({ ref: 'submitImport' });
    clearOriginalData.setChecked(false);
    submit.trigger('click');
    await flushPromises();

    expect(actions.importColorSwatches.mock.calls[0][1].clearPrevious).toBe(
      false
    );
  });

  it('submitting with valid data emits showView when complete', async () => {
    wrapper.setData({ importData: '#000' });
    const submit = wrapper.find({ ref: 'submitImport' });
    submit.trigger('click');
    await flushPromises();

    expect(wrapper.emitted('showView')[0]).toEqual(['Colors']);
  });

  it('submitting with invalid data emits nothing', async () => {
    wrapper.setData({ importData: '#00' });
    const submit = wrapper.find({ ref: 'submitImport' });
    submit.trigger('click');
    await flushPromises();

    expect(wrapper.emitted('showView')).toBeFalsy();
  });
});

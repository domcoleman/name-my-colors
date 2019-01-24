import Export from '@/components/Views/Export';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Export.vue', () => {
  let actions;
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    state = {
      swatches: [
        {
          hex: 'FF0000',
          r: 255,
          g: 0,
          b: 0,
          h: 0,
          s: 100,
          v: 100,
          name: 'Red'
        },
        {
          hex: '0000FF',
          r: 0,
          g: 0,
          b: 255,
          h: 240,
          s: 100,
          v: 100,
          name: 'Blue'
        },
        {
          hex: 'DCEDB4',
          r: 220,
          g: 237,
          b: 180,
          h: 78,
          s: 24,
          v: 93,
          name: 'Caper'
        },
        {
          hex: '0000C8',
          r: 0,
          g: 0,
          b: 200,
          h: 240,
          s: 100,
          v: 78,
          name: 'Dark Blue'
        },
        {
          hex: '00FF00',
          r: 0,
          g: 255,
          b: 0,
          h: 120,
          s: 100,
          v: 100,
          name: 'Green'
        },
        {
          hex: '0AFF3B',
          r: 10,
          g: 255,
          b: 59,
          h: 132,
          s: 96,
          v: 100,
          name: 'Green'
        },
        {
          hex: 'C7369E',
          r: 199,
          g: 65,
          b: 158,
          h: 317,
          s: 73,
          v: 78,
          name: 'Medium Red Violet'
        }
      ],
      activeSwatch: 1
    };
    store = new Vuex.Store({ state, actions });
    wrapper = shallowMount(Export, { store, localVue, attachToDocument: true });
  });

  it('exports color names in proper format', () => {
    const exportField = wrapper.find({ ref: 'exportData' });

    expect(exportField.element.value).toContain('medium-red-violet');
  });

  it('exports color names followed by their value', () => {
    const exportField = wrapper.find({ ref: 'exportData' });

    expect(exportField.element.value).toContain('red: #FF0000');
  });

  it('exports colors as a CSS variable by default', () => {
    const exportField = wrapper.find({ ref: 'exportData' });

    expect(exportField.element.value).toContain('--red:');
  });

  it.each([
    ['CSS', '--red:'],
    ['SCSS', '$red:'],
    ['SASS', '$red:'],
    ['Stylus', '$red ='],
    ['Less', '@red:']
  ])('exports colors as a %s variable once selected', (processor, expected) => {
    const exportField = wrapper.find({ ref: 'exportData' });
    const radioSelect = wrapper.find({ ref: `exportProcessor${processor}` });
    radioSelect.setChecked();

    expect(exportField.element.value).toContain(expected);
  });

  it('exports colors in hex format by default', () => {
    const exportField = wrapper.find({ ref: 'exportData' });

    expect(exportField.element.value).toContain('#FF0000');
  });

  it.each([['Hex', '#FF0000'], ['RGB', 'rgb(255, 0, 0)']])(
    'exports colors in %s format once selected',
    (format, expected) => {
      const exportField = wrapper.find({ ref: 'exportData' });
      const radioSelect = wrapper.find({ ref: `exportFormat${format}` });
      radioSelect.setChecked();

      expect(exportField.element.value).toContain(expected);
    }
  );

  it('does not export duplicates of swatches', () => {
    state.swatches.push(state.swatches[0]);
    const exportField = wrapper.find({ ref: 'exportData' });

    expect(exportField.element.value).not.toMatch(/#FF0000.+#FF0000:/s);
  });

  it('exports each color swatch', () => {
    const exportField = wrapper.find({ ref: 'exportData' });

    for (let index = 0; index < state.swatches.length; index++) {
      expect(exportField.element.value).toContain(state.swatches[index].hex);
    }
  });

  it('numbers colors with the same name but different values', () => {
    const exportField = wrapper.find({ ref: 'exportData' });

    expect(exportField.element.value).toMatch(/green.+green-2/s);
  });

  it('exports each color swatch in original order by default', () => {
    const exportField = wrapper.find({ ref: 'exportData' });

    expect(exportField.element.value).toMatch(
      /red.+blue.+caper.+dark-blue.+green/s
    );
  });

  it.each([
    ['original', 'None', /red.+blue.+caper.+dark-blue.+green/s],
    ['alphabetical', 'Name', /blue.+caper.+dark-blue.+green.+red/s],
    ['ascending hue', 'Hue', /red.+caper.+green.+blue.+dark-blue/s],
    ['descending sat', 'Saturation', /red.+blue.+dark-blue.+green.+caper/s],
    ['descending value', 'Value', /red.+blue.+green.+caper.+dark-blue/s]
  ])(
    'exports each color swatch in %s order when %s is selected',
    (_, orderBy, expected) => {
      const exportField = wrapper.find({ ref: 'exportData' });
      const radioSelect = wrapper.find({ ref: `exportSort${orderBy}` });
      radioSelect.setChecked();

      expect(exportField.element.value).toMatch(expected);
    }
  );
});

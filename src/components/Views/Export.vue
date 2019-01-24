<template>
  <main class="content">
    <h2 class="title">Export Colors</h2>
    <fieldset class="radio-fieldset">
      <legend>Processor</legend>
      <ul class="radio">
        <li
          v-for="processor of processors"
          :key="`processor-${processor.name}`"
        >
          <input
            v-model="exportAs"
            :value="processor.name"
            :id="`export-processor-${processor.name}`"
            :ref="`exportProcessor${processor.name}`"
            class="radio-input"
            type="radio"
          />
          <label
            :for="`export-processor-${processor.name}`"
            class="radio-label"
            >{{ processor.name }}</label
          >
        </li>
      </ul>
    </fieldset>
    <fieldset class="radio-fieldset">
      <legend>Sort By</legend>
      <ul class="radio">
        <li v-for="(sortName, sortKey) of sortOptions" :key="`sort-${sortKey}`">
          <input
            v-model="sortBy"
            :value="sortKey"
            :id="`export-sort-${sortKey}`"
            :ref="`exportSort${sortName}`"
            class="radio-input"
            type="radio"
          />
          <label :for="`export-sort-${sortKey}`" class="radio-label">{{
            sortName
          }}</label>
        </li>
      </ul>
    </fieldset>
    <fieldset class="radio-fieldset">
      <legend>Color Format</legend>
      <ul class="radio">
        <li>
          <input
            v-model="exportAsHex"
            :value="false"
            class="radio-input"
            id="format-rgb"
            type="radio"
            ref="exportFormatRGB"
          />
          <label for="format-rgb" class="radio-label">RGB</label>
        </li>
        <li>
          <input
            v-model="exportAsHex"
            :value="true"
            class="radio-input"
            id="format-hex"
            type="radio"
            ref="exportFormatHex"
          />
          <label for="format-hex" class="radio-label">Hex</label>
        </li>
      </ul>
    </fieldset>
    <textarea
      v-model="exportData"
      class="textarea"
      ref="exportData"
      readonly
      @click="selectExportData"
    />
    <section class="form-controls">
      <button @click.prevent="copyHexCodes" class="button" ref="copyHexCodes">
        {{ copyButtonText }}
      </button>
    </section>
  </main>
</template>

<script>
import '@/assets/scss/components/forms.scss';
import { mapState } from 'vuex';

export default {
  name: 'Export',
  data() {
    return {
      processors: [
        { name: 'CSS', prefix: '--', assigner: ': ', suffix: ';' },
        { name: 'SCSS', prefix: '$', assigner: ': ', suffix: ';' },
        { name: 'SASS', prefix: '$', assigner: ': ', suffix: '' },
        { name: 'Stylus', prefix: '$', assigner: ' = ', suffix: '' },
        { name: 'Less', prefix: '@', assigner: ': ', suffix: ';' }
      ],
      exportAs: 'CSS',
      exportAsHex: true,
      sortOptions: {
        none: 'None',
        name: 'Name',
        h: 'Hue',
        s: 'Saturation',
        v: 'Value'
      },
      sortBy: 'none',
      isRecentlyCopied: false
    };
  },
  computed: {
    ...mapState(['swatches']),
    exportData() {
      const sortedData = this.swatches.slice(0).sort(this.sortData);
      return [...new Set(sortedData.map(this.mapSwatch))].join(`\n`);
    },
    exportFormat() {
      return this.processors.find(
        processor => processor.name === this.exportAs
      );
    },
    copyButtonText() {
      return this.isRecentlyCopied ? 'Copied' : 'Copy';
    }
  },
  methods: {
    convertSwatchName(swatchName) {
      return swatchName.toLowerCase().replace(/ /g, '-');
    },
    mapSwatch(swatch, swatchIndex, swatches) {
      const colorNumber = swatches
        .slice(0, swatchIndex)
        .reduce(
          (accumulator, currentSwatch) =>
            currentSwatch.name === swatch.name ? accumulator + 1 : accumulator,
          1
        );
      const swatchName = this.convertSwatchName(swatch.name);

      return [
        this.exportFormat.prefix,
        swatchName + (colorNumber > 1 ? `-${colorNumber}` : ''),
        this.exportFormat.assigner,
        this.colorFormat(swatch),
        this.exportFormat.suffix
      ].join('');
    },
    colorFormat(swatch) {
      return this.exportAsHex
        ? `#${swatch.hex}`
        : `rgb(${swatch.r}, ${swatch.g}, ${swatch.b})`;
    },
    sortData(swatchA, swatchB) {
      if (this.sortBy === 'none') return 0;
      if (this.sortBy === 'name') {
        if (swatchA.name < swatchB.name) return -1;
        if (swatchA.name > swatchB.name) return 1;
        return 0;
      }
      if (!['h', 's', 'v'].includes(this.sortBy)) return 0;
      if (this.sortBy === 'h')
        return swatchA[this.sortBy] - swatchB[this.sortBy];
      return swatchB[this.sortBy] - swatchA[this.sortBy];
    },
    selectExportData() {
      this.$refs.exportData.select();
    },
    copyHexCodes() {
      this.selectExportData();
      document.execCommand('copy');
      document.getSelection().empty();
      this.isRecentlyCopied = true;
      setTimeout(() => (this.isRecentlyCopied = false), 5000);
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
}
</style>

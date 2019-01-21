<template>
  <main class="content">
    <h2 class="title">Import Colors</h2>
    <p>
      Paste your hexcodes below, separated by a space or new line. Hashes are
      optional.
    </p>
    <textarea v-model="importData" class="textarea" ref="importData"></textarea>
    <label for="clear-swatches">
      <input
        v-model="clearOriginalData"
        type="checkbox"
        id="clear-swatches"
        ref="clearOriginalData"
      />
      Delete Old Swatches
    </label>
    <section class="form-controls">
      <button
        type="submit"
        @click.prevent="importHexCodes"
        class="button"
        ref="submitImport"
      >
        Import
      </button>
    </section>
  </main>
</template>

<script>
import '@/assets/scss/components/forms.scss';
import { mapActions } from 'vuex';

export default {
  name: 'Import',
  data() {
    return {
      importData: '',
      clearOriginalData: false
    };
  },
  methods: {
    ...mapActions(['importColorSwatches']),
    async importHexCodes() {
      const colorValues = this.importData
        .split(/[ \n,]/)
        .filter(this.isValidHexCode)
        .map(this.createHexCode)
        .map(hexcode => hexcode.toUpperCase());

      console.log('called');
      if (!colorValues.length) {
        this.importData = 'No hex codes added';
      } else {
        console.log('found stuff');
        this.importColorSwatches({
          colorValues,
          clearPrevious: this.clearOriginalData
        }).then(() => this.$emit('showView', 'Colors'));
      }
    },
    isValidHexCode(hexCode) {
      return /^#?([A-F0-9]{3}|[A-F0-9]{6})$/i.test(hexCode);
    },
    createHexCode(hexCode) {
      return hexCode.length < 6
        ? hexCode.replace(/#?([A-F0-9])([A-F0-9])([A-F0-9])/i, '$1$1$2$2$3$3')
        : hexCode.replace(/#/, '');
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

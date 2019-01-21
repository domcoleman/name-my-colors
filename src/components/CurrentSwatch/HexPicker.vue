<template>
  <input
    :value="hex"
    type="text"
    class="color-hex"
    maxlength="7"
    @input="handleInput"
    @focus="selectAll"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'CurrentSwatch-HexPicker',
  computed: {
    ...mapGetters(['activeSwatchProperty']),
    hex() {
      return '#' + this.activeSwatchProperty('hex');
    }
  },
  methods: {
    ...mapActions(['updateColorSwatch']),
    handleInput(event) {
      if (/^#?([0-9A-F]{6})$/i.test(event.target.value)) {
        this.updateColorSwatch({
          colorProperties: { hex: event.target.value }
        });
      }
    },
    selectAll(event) {
      event.target.select();
    }
  }
};
</script>

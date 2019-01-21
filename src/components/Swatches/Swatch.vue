<template>
  <li class="swatch">
    <a
      ref="swatchAnchor"
      :title="`${swatch.name}\n#${swatch.hex}`"
      :style="{ backgroundColor }"
      :data-active="isActive"
      class="swatch-inner"
      draggable="true"
      @click="setSwatchActive"
      @dragstart="startDragging"
      @dragend="stopDragging"
    />
  </li>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SwatchesSwatch',
  props: {
    swatchIndex: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters(['swatchByIndex']),
    swatch() {
      return this.swatchByIndex(this.swatchIndex);
    },
    backgroundColor() {
      const { r, g, b } = this.swatch;
      return `rgb(${r}, ${g}, ${b})`;
    },
    isActive() {
      return this.$store.state.activeSwatch === this.swatchIndex;
    }
  },
  methods: {
    setSwatchActive() {
      this.$store.dispatch('setActiveSwatch', {
        swatchIndex: this.swatchIndex
      });
    },
    startDragging(event) {
      event.dataTransfer.setData('text', this.swatchIndex);
    },
    stopDragging(event) {
      event.dataTransfer.clearData('text');
    }
  }
};
</script>

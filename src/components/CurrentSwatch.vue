<template>
  <section class="current-swatch">
    <div class="visual-pickers">
      <SatValPicker />
      <HuePicker />
    </div>
    <ul class="input-pickers">
      <NumPicker
        v-for="property of ['r', 'g', 'b', 'h', 's', 'v']"
        :key="`color-property-${property}`"
        :color-property="property"
      />
    </ul>
    <h2 class="color-name" ref="colorName">{{ colorName }}</h2>
    <HexPicker />
    <div
      :style="{ backgroundColor }"
      class="color-preview"
      ref="colorPreview"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import SatValPicker from '@/components/CurrentSwatch/SatValPicker';
import HuePicker from '@/components/CurrentSwatch/HuePicker';
import HexPicker from '@/components/CurrentSwatch/HexPicker';
import NumPicker from '@/components/CurrentSwatch/NumPicker';

export default {
  name: 'CurrentSwatch',
  components: {
    SatValPicker,
    HuePicker,
    NumPicker,
    HexPicker
  },
  computed: {
    ...mapGetters(['activeSwatchProperty']),
    backgroundColor() {
      const rgb = [
        this.activeSwatchProperty('r'),
        this.activeSwatchProperty('g'),
        this.activeSwatchProperty('b')
      ];
      return `rgb(${rgb.join(', ')})`;
    },
    colorName() {
      return this.activeSwatchProperty('name');
    }
  }
};
</script>

<style lang="scss">
.current-swatch {
  margin: 0.25rem;
  display: grid;
  grid-template-columns: 14rem auto;
  grid-template-areas: 'visual-pickers input-pickers' 'color-name color-hex' 'color-result color-result';
  grid-column-gap: 0.25rem;
  grid-row-gap: 0.25rem;

  @include media('>tablet') {
    grid-template-columns: 20rem auto;
  }
}

.visual-pickers {
  display: flex;
  justify-content: space-between;
}

.input-pickers {
  display: flex;
  flex-direction: column;
}

.color-name {
  grid-area: color-name;
}

.color-hex {
  grid-area: color-hex;
  width: 100%;
  background: transparent;
  border: none;
  text-align: right;
}

.color-preview {
  grid-area: color-result;
  width: 100%;
  height: 3rem;
  border: 1px solid black;
  border-radius: $border-radius;
  transition: background-color 0.3s ease-in-out;
}
</style>

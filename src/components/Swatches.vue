<template>
  <ul class="swatch-picker">
    <li class="swatch">
      <a
        ref="newSwatch"
        class="swatch-inner swatch-inner--create"
        title="New Swatch"
        @dragover="dragPrevent"
        @dragenter="dragPrevent"
        @drop="newColorSwatch"
        @click="newColorSwatch"
      />
    </li>
    <Swatch
      v-for="(swatch, index) of swatches"
      :key="`swatch-${index}`"
      :swatch-index="index"
    />
    <li class="swatch">
      <a
        ref="deleteSwatch"
        class="swatch-inner swatch-inner--delete"
        title="Delete Swatch"
        @dragover="dragPrevent"
        @dragenter="dragPrevent"
        @drop="deleteColorSwatch"
        @click="deleteColorSwatch"
      />
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Swatch from '@/components/Swatches/Swatch';

export default {
  name: 'Swatches',
  components: {
    Swatch
  },
  computed: {
    ...mapState(['swatches', 'activeSwatch'])
  },
  methods: {
    newColorSwatch(event) {
      const colorValue =
        event.type === 'click'
          ? null
          : this.swatches[event.dataTransfer.getData('text')].hex;
      this.createColorSwatch({ colorValue, setActive: true });
    },
    deleteColorSwatch(event) {
      const swatchIndex =
        event.type === 'click'
          ? this.activeSwatch
          : event.dataTransfer.getData('text');
      this.removeColorSwatch({ swatchIndex });
    },
    dragPrevent(event) {
      event.preventDefault();
    },
    ...mapActions(['createColorSwatch', 'removeColorSwatch'])
  }
};
</script>

<style lang="scss">
.swatch-picker {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
}

.swatch {
  position: relative;
  margin: 0.25rem;
  height: 2.25rem;
  width: 2.25rem;
  border-radius: $border-radius;
  background: rgba(0, 0, 0, 0.2);

  &:last-of-type {
    margin-left: auto;
  }
}

.swatch-inner {
  position: relative;
  cursor: pointer;
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid;
  border-radius: $border-radius;
  transition: all 0.3s ease-in-out;

  &[data-active] {
    transform: scale(1.2);
  }

  &--create,
  &--delete {
    &:before,
    &:after {
      position: absolute;
      content: '';
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      width: 1.5rem;
      height: 0.25rem;
      background: $content-color;
    }
  }

  &--create:after {
    transform: translate3d(-50%, -50%, 0) rotate(90deg);
  }
}
</style>

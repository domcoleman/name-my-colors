<template>
  <div class="hue-slider" @click="handleMovement" @mousedown="startMousedown">
    <div :style="positionBarStyle" ref="positionBar" class="hue-position" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { trackMovement } from '@/mixins/trackMovement';

export default {
  name: 'HuePicker',
  mixins: [trackMovement],
  computed: {
    ...mapGetters(['activeSwatchProperty']),
    positionBarStyle() {
      return {
        top: Math.floor((this.activeSwatchProperty('h') / 360) * 100) + '%'
      };
    }
  },
  methods: {
    ...mapActions(['updateColorSwatch']),
    handleMovement(event) {
      const { yAxis: hue } = this.trackMovement(event, { maxValue: 360 });
      this.updateColorSwatch({
        colorProperties: { h: hue >= 360 ? 359 : hue }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.hue-slider {
  cursor: row-resize;
  position: relative;
  height: 11rem;
  width: 2rem;
  border-radius: $border-radius;
  border: 1px solid black;
  background-image: linear-gradient(
    to bottom,
    rgb(255, 0, 0) 0%,
    rgb(255, 255, 0) 17%,
    rgb(0, 255, 0) 33%,
    rgb(0, 255, 255) 50%,
    rgb(0, 0, 255) 66%,
    rgb(255, 0, 255) 83%,
    rgb(255, 0, 0) 100%
  );

  @include media('>tablet') {
    height: 17rem;
  }
}

.hue-position {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  height: 0.5rem;
  width: 2.25rem;
  background: white;
  border: 1px solid black;
  border-radius: $border-radius;
}
</style>

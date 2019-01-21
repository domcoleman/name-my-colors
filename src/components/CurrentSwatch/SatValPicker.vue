<template>
  <div
    :style="areaStyle"
    class="sat-val-area"
    @click="handleMovement"
    @mousedown="startMousedown"
  >
    <div :style="dropperStyle" class="sat-val-dropper" ref="positionDropper" />
  </div>
</template>

<script>
import colorConvert from 'color-convert';
import { mapGetters, mapActions } from 'vuex';
import { trackMovement } from '@/mixins/trackMovement';

export default {
  name: 'SatValPicker',
  mixins: [trackMovement],
  computed: {
    ...mapGetters(['activeSwatchProperty']),
    areaStyle() {
      const hueValue = this.activeSwatchProperty('h');
      return {
        backgroundColor: '#' + colorConvert.hsv.hex(hueValue, 100, 100)
      };
    },
    dropperStyle() {
      return {
        left: this.activeSwatchProperty('s') + '%',
        top: 100 - this.activeSwatchProperty('v') + '%'
      };
    }
  },
  methods: {
    ...mapActions(['updateColorSwatch']),
    handleMovement(event) {
      const { xAxis: saturation, yAxis: value } = this.trackMovement(event);
      this.updateColorSwatch({
        colorProperties: { s: saturation, v: 100 - value }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sat-val-area {
  cursor: crosshair;
  position: relative;
  height: 11rem;
  width: 11rem;
  border-radius: $border-radius;
  border: 1px solid $black;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 100%
    ),
    linear-gradient(
      to right,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );

  @include media('>tablet') {
    width: 17rem;
    height: 17rem;
  }
}

.sat-val-dropper {
  position: absolute;
  top: 100%;
  left: 0%;
  transform: translate3d(-50%, -50%, 0);
  height: 20px;
  width: 20px;
  border: 2px solid black;
  border-radius: 100%;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    border-radius: 100%;
  }

  &:before {
    border: 3px solid white;
    width: 16px;
    height: 16px;
  }

  &:after {
    border: 2px solid black;
    width: 10px;
    height: 10px;
  }
}
</style>

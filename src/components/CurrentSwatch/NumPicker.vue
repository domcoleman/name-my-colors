<template>
  <li class="number-picker">
    <label :for="`number-picker-${colorProperty}`" ref="numberPickerLabel">
      {{ colorProperty | uppercase }}:
    </label>
    <input
      :id="`number-picker-${colorProperty}`"
      :value="currentValue"
      :max="maxValue"
      :min="minValue"
      ref="numberPickerInput"
      type="number"
      @input="handleInput"
    />
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'CurrentSwatch-NumPicker',
  props: {
    colorProperty: {
      type: String,
      validator: value => ['r', 'g', 'b', 'h', 's', 'v'].includes(value)
    }
  },
  computed: {
    ...mapGetters(['activeSwatchProperty']),
    currentValue() {
      return this.activeSwatchProperty(this.colorProperty);
    },
    minValue() {
      return this.colorProperty === 'h' ? -1 : 0;
    },
    maxValue() {
      return ['s', 'v'].includes(this.colorProperty)
        ? 100
        : this.colorProperty === 'h'
        ? 360
        : 255;
    }
  },
  methods: {
    ...mapActions(['updateColorSwatch']),
    handleInput(event) {
      this.updateColorSwatch({
        colorProperties: { [this.colorProperty]: +event.target.value }
      });
    }
  },
  filters: {
    uppercase: value => value.toUpperCase()
  }
};
</script>

<style lang="scss" scoped>
.number-picker {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &:not(:first-of-type) {
    margin-top: 0.25rem;
  }

  label {
    font-size: 0.8rem;
    margin-right: 0.125rem;
  }

  input {
    width: 2.75rem;
    text-align: right;
  }
}
</style>

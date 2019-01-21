export const trackMovement = {
  methods: {
    // Must be rewritten within component
    handleMovement(event) {
      event.preventDefault();
    },
    // Actual methods
    trackMovement(event, { maxValue } = { maxValue: 100 }) {
      const { top, height, left, width } = event.hasOwnProperty('testRect')
        ? event.testRect
        : this.$el.getBoundingClientRect();

      return {
        xAxis: this.calculatePosition({
          mousePosition: event.clientX,
          elPosition: left,
          elDimension: width,
          maxValue
        }),
        yAxis: this.calculatePosition({
          mousePosition: event.clientY,
          elPosition: top,
          elDimension: height,
          maxValue
        })
      };
    },
    calculatePosition({ mousePosition, elPosition, elDimension, maxValue }) {
      return mousePosition >= elPosition
        ? mousePosition < elPosition + elDimension
          ? Math.floor(((mousePosition - elPosition) / elDimension) * maxValue)
          : maxValue
        : 0;
    },
    startMousedown(event) {
      event.preventDefault();
      document.addEventListener('mousemove', this.handleMovement);
      document.addEventListener('mouseup', this.stopMousedown);
    },
    stopMousedown(event) {
      event.preventDefault();
      document.removeEventListener('mousemove', this.handleMovement);
      document.removeEventListener('mouseup', this.stopMousedown);
    }
  }
};

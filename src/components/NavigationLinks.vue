<template>
  <nav class="navigation-links">
    <a
      v-for="(view, index) of views"
      :key="`view-link-${index}`"
      :data-active="view === currentView"
      ref="viewLink"
      class="view-link"
      @click="showView(view)"
    >
      {{ view }}
    </a>
  </nav>
</template>

<script>
export default {
  name: 'NavigationLinks',
  props: {
    views: {
      type: Array,
      required: true
    },
    currentView: {
      type: String,
      required: true
    }
  },
  methods: {
    showView(component) {
      if (component !== this.currentView) this.$emit('showView', component);
    }
  }
};
</script>

<style lang="scss" scoped>
.navigation-links {
  display: flex;
  margin: 0.25rem;
  justify-content: space-evenly;
}

.view-link {
  cursor: pointer;
  color: $link-color;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: $active-link-color;
  }

  &[data-active] {
    color: $active-link-color;
  }
}
</style>

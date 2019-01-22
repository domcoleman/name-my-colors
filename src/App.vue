<template>
  <div class="wrapper">
    <transition name="fade" mode="out-in">
      <component ref="currentView" :is="currentView" @showView="switchView" />
    </transition>
    <NavigationLinks
      :views="views"
      :current-view="currentView"
      ref="navigationLinks"
      @showView="switchView"
    />
  </div>
</template>

<script>
// SCSS
import '@/assets/scss/base/reset.scss';
import '@/assets/scss/base/base.scss';
import '@/assets/scss/base/typography.scss';

// Components
import NavigationLinks from '@/components/NavigationLinks';
import Colors from '@/components/Views/Colors';
import Import from '@/components/Views/Import';
import Export from '@/components/Views/Export';
import About from '@/components/Views/About';

export default {
  name: 'NameMyColors',
  components: {
    NavigationLinks,
    Colors,
    Import,
    Export,
    About
  },
  data() {
    return {
      views: ['Colors', 'Import', 'Export', 'About'],
      currentView: 'Colors'
    };
  },
  methods: {
    switchView(component) {
      if (this.$options.components[component]) this.currentView = component;
    }
  },
  created() {
    this.$store.dispatch('createColorSwatch', { setActive: true });
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

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

export default {
  name: 'NameMyColors',
  components: {
    NavigationLinks,
    Colors,
    Import: () => import('@/components/Views/Import'),
    Export: () => import('@/components/Views/Export'),
    About: () => import('@/components/Views/About')
  },
  data() {
    return {
      views: ['Colors', 'Import', 'Export', 'About'],
      currentView: 'Colors'
    };
  },
  methods: {
    switchView(component) {
      if (this.views.includes(component)) this.currentView = component;
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

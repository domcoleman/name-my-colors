<template>
  <main class="content">
    <CurrentSwatch />
    <Swatches />
  </main>
</template>

<script>
import CurrentSwatch from '@/components/CurrentSwatch';
import Swatches from '@/components/Swatches';

export default {
  name: 'Colors',
  components: {
    CurrentSwatch,
    Swatches
  }
};
</script>

<style scoped>
.content {
  margin: 0;
}
</style>

<template>
  <main class="content">
    <CurrentSwatch />
    <Swatches />
  </main>
</template>

<script>
export default {
  name: 'Colors',
  components: {
    CurrentSwatch: () => ({}),
    Swatches: () => ({})
  }
};
</script>

<style scoped>
.content {
  margin: 0;
}
</style>

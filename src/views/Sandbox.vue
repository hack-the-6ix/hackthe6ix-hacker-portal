<template>
  <div class="owo">
    <Resources/>
  </div>
</template>

<script>
import Resources from '@/views/Dashboard/Resources';

export default {
  components: {
    Resources,
  },
}
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.owo {
  background-color: white;
}
</style>

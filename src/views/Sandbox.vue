<template>
  <div class="owo">
    <Calendar/>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar';

export default {
  components: {
    Calendar,
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

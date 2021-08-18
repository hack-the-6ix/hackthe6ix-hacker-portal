<template>
  <Calendar class="calendar-page" />
</template>

<script>
import Calendar from '@/components/Calendar';

export default {
  components: {
    Calendar,
  },
};
</script>

<style lang="scss">
@use '@/styles/units';

html {
  background: white;
}
</style>

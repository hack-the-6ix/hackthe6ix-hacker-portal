<template>
  <div class="schedule">
    <div class="schedule__content">
      <Typography
        class="schedule__title"
        transform="uppercase"
        color="dark-navy"
        type="heading3"
        as="h1"
      >
        Schedule
      </Typography>
      <Calendar/>
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';
import Calendar from '@/components/Calendar';

export default {
  components: {
    Typography,
    Calendar,
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/units';

.schedule {
  padding: units.spacing(16);
  $self: &;

  @include mixins.media(phone) {
    padding: units.spacing(16) units.spacing(12);
  }

  &__content {
    max-width: 900px;
    margin: 0 auto;
  }
}
</style>

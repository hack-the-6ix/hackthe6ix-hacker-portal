<template>
  <div class="schedule">
    <div class="schedule__content">
      <div class="schedule__header">
        <Typography
          class="schedule__title"
          transform="uppercase"
          color="dark-navy"
          type="heading3"
          as="h1"
        >
          Schedule
        </Typography>
        <Button
          href='/calendar'
          rel='noreferrer noopener'
          class='schedule__btn'
          target='_blank'
          as='a'
        >
          View Expanded
        </Button>
      </div>
      <Calendar/>
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';
import Calendar from '@/components/Calendar';
import Button from '@/components/Button';

export default {
  components: {
    Typography,
    Calendar,
    Button,
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

  &__title {
    margin-bottom: units.spacing(4);
    @include mixins.media(phone) {
      margin-bottom: units.spacing(2);
    }
  }

  &__header {
    justify-content: space-between;
    display: flex;

    @include mixins.media(phone) {
      flex-direction: column;
      margin-bottom: units.spacing(6);
    }
  }

  &__btn {
    margin-bottom: auto;
  }
}
</style>

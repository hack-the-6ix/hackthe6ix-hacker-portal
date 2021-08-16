<template>
  <div class='calendar-modal'>
    <div class='calendar-modal__box'>
      <div class='calendar-modal__header'>
        <Typography color='dark-navy' type='heading3' as='h2'>
          {{ modelValue.get('Name') }}
        </Typography>
        <button
          @click='$emit("update:modelValue", null)'
          class='calendar-modal__close'
        >
          <i class='fas fa-times'/>
        </button>
        <hr
          :style='{ "--color": eventType?.Color }'
          class='calendar-modal__line'
        />
      </div>
      <ul class='calendar-modal__content'>
        <template v-for='(info, i) in eventContent' :key='i'>
          <Typography
            class='calendar-modal__item'
            v-if='info.content'
            color='black'
            type='body1'
            as='li'
          >
            <i :class='[info.icon, "calendar-modal__icon"]'/>
            <span>{{ info.content }}</span>
          </Typography>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';

export default {
  components: {
    Typography,
  },
  props: {
    modelValue: Object,
    types: {
      type: Object,
      default: () => new Map(),
    },
    hosts: {
      type: Object,
      default: () => new Map(),
    },
  },
  emits: ['update:modelValue'],
  computed: {
    eventContent() {
      return [
        {
          icon: 'fas fa-clock',
          content: this.eventDateTime,
        },
        {
          icon: 'fas fa-map-marker-alt',
          content: this.modelValue.get('Platform') ?? 'N/A',
        },
        {
          icon: 'fas fa-sticky-note',
          content: this.modelValue.get('Description'),
        },
      ];
    },
    eventDateTime() {
      const s = new Date(this.modelValue?.get('Start'));
      const date = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(s);

      let dateTH = 'th';
      switch(s.getDate().toString().charAt(1)) {
        case '1':
          dateTH = 'st';
          break;
        case '2':
          dateTH = 'nd';
          break;
        case '3':
          dateTH = 'rd';
          break;
      }

      const processTime = time => {
        const dt = new Date(time);
        const m = dt.getMinutes();
        const h = dt.getHours();

        return `${(h % 12) ?? 12}${m ? ':30' : ''}${h < 12 ? 'am' : 'pm'}`;
      };

      const start = processTime(this.modelValue?.get('Start'));
      const end = processTime(this.modelValue?.get('End'));
      return `${date}${dateTH} | ${start} - ${end}`;
    },
    eventType() {
      return this.types.get(
        this.modelValue?.get('Type of Event')?.[0],
      );
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.calendar-modal {
  background-color: rgba(0, 0, 0, 0.3);
  padding: units.spacing(4);
  justify-content: center;
  box-sizing: border-box;
  align-items: center;
  position: fixed;
  display: flex;
  height: 100%;
  margin: auto;
  width: 100%;
  inset: 0;

  &__box {
    box-shadow: units.spacing(1) units.spacing(1) units.spacing(10) units.spacing(3) rgba(0, 0, 0, 0.2);
    background-color: colors.css-color(white);
    border-radius: units.spacing(3);
    padding: units.spacing(10);
    width: units.spacing(160);
    box-sizing: border-box;
    height: fit-content;
    overflow: auto;
  }

  &__header {
    grid-template-columns: auto units.spacing(5.5);
    grid-gap: units.spacing(2) units.spacing(4);
    display: grid;
  }

  &__line {
    background-color: var(--color, #{colors.css-color(disabled)});
    height: units.spacing(1);
    width: units.spacing(26);
    border-radius: 999px;
    border: none;
    margin: 0;
  }

  &__close {
    color: colors.css-color(dark-navy);
    font-size: 1.4rem;
    background: none;
    cursor: pointer;
    margin: auto 0;
    border: none;
    padding: 0;

    &:hover, &:focus {
      color: colors.css-color(dark-navy, hover);
    }

    &:active {
      color: colors.css-color(dark-navy, active);
    }

    & > i {
      @include mixins.transition(color);
    }
  }

  &__content {
    margin: units.spacing(6) 0 0;
    grid-gap: units.spacing(6);
    list-style-type: none;
    display: grid;
    padding: 0;
  }

  &__item {
    grid-template-columns: units.spacing(4) auto;
    grid-gap: units.spacing(4);
    display: grid;
  }

  &__icon {
    color: colors.css-color(dark-navy);
    font-size: 1rem;
    margin-top: units.spacing(0.75);
  }
}
</style>
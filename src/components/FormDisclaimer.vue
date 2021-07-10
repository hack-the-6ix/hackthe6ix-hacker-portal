<template>
  <div
    :class='[
      type && `form-disclaimer--${type}`,
      "form-disclaimer",
    ]'
  >
    <ErrorCircle class='form-disclaimer__icon'/>
    <div class='form-disclaimer__section'>
      <div
        v-for='(section, i) in data'
        :key='i'
      >
        <Typography
          class='form-disclaimer__label'
          type='heading4'
          color='black'
          as='p'
        >
          {{section.label}}
        </Typography>
        <ul class='form-disclaimer__list'>
          <Typography
            class='form-disclaimer__list-item'
            v-for='(item, j) in section.items'
            type='heading4'
            v-html='item'
            color='navy'
            :key='j'
            as='li'
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';
import ErrorCircle from '@/assets/error-circle.svg';

export default {
  components: {
    Typography,
    ErrorCircle,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    data: Array,
  },
};
</script>

<style lang="scss">
@use '@/styles/colors';
@use '@/styles/units';

.form-disclaimer {
  --form-disclaimer__color: var(#{colors.css-var(dark-disabled)});
  border-left: units.spacing(1) solid rgba(var(--form-disclaimer__color), 1);
  background-color: rgba(var(--form-disclaimer__color), 0.08);
  grid-template-columns: units.spacing(10) auto;
  padding: units.spacing(9) units.spacing(10);
  grid-gap: units.spacing(10);
  display: grid;

  &--error {
    --form-disclaimer__color: var(#{colors.css-var(error)});
  }

  &__icon {
    color: rgba(var(--form-disclaimer__color), 1);
  }

  &__section {
    grid-template-columns: minmax(1px, 1fr);
    grid-gap: units.spacing(7);
    display: grid;
  }

  &__label {
    color: colors.css-color(black);
  }

  &__list {
    grid-template-columns: minmax(1px, 1fr);
    padding: 0 0 0 units.spacing(7);
    margin: units.spacing(2) 0 0;
    grid-gap: units.spacing(1);
    display: grid;
  }

  &__list-item {
    color: rgba(var(--form-disclaimer__color), 1);
  }
}
</style>

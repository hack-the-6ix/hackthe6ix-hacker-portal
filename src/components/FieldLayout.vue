<template>
  <div
    :class="[
      disabled && 'field-layout--disabled',
      error && 'field-layout--error',
      'field-layout',
    ]"
  >
    <Typography
      class="field-layout__label"
      color="dark-navy"
      type="heading4"
      as="label"
      :for="id"
    >
      <span v-html="label" />{{ required ? '*' : '' }}
    </Typography>
    <div
      :class="['field-layout__main', !noOutline && 'field-layout--outlined']"
    >
      <slot />
      <WarningIcon v-if="error" class="field-layout__error-icon" />
    </div>
    <Typography v-if="error" type="small" as="p" color="error">
      {{ error }}
    </Typography>
    <Typography v-else-if="info" type="small" as="p" color="disabled">
      {{ info }}
    </Typography>
  </div>
</template>

<script>
import Typography from '@/components/Typography';
import WarningIcon from '@/assets/warning.svg';

export default {
  components: {
    Typography,
    WarningIcon,
  },
  props: {
    noOutline: Boolean,
    required: Boolean,
    disabled: Boolean,
    error: String,
    info: String,
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/colors';
@use '@/styles/units';

.field-layout {
  --field-layout__background: transparent;
  --field-layout__color: #{colors.css-color(dark-navy)};
  grid-template-columns: 1fr;
  grid-gap: units.spacing(1);
  display: grid;

  &--outlined {
    border: 1px solid var(--field-layout__color);
  }

  &--error {
    --field-layout__color: #{colors.css-color(error)};
    --field-layout__background: #{colors.css-color(error, $alpha: 0.15)};
  }

  &--disabled {
    --field-layout__color: #{colors.css-color(disabled)};
    --field-layout__background: #{colors.css-color(disabled, $alpha: 0.15)};
  }

  &__label {
    color: var(--field-layout__color);
  }

  &__main {
    border-radius: units.spacing(0.5);
    box-sizing: border-box;
    position: relative;
    width: 100%;
  }

  &__error-icon {
    inset: auto units.spacing(3) units.spacing(2) auto;
    transform: translateY(-15%);
    color: colors.css-color(error);
    width: units.spacing(0.75);
    position: absolute;
    height: auto;
    margin: 0;
  }
}
</style>

<template>
  <Typography
    :class="[
      disabled && 'button--disabled',
      type && `button--type--${type}`,
      `button--color--${color}`,
      'button',
    ]"
    :disabled="disabled"
    :htmlType="htmlType"
    type="heading4"
    align="center"
    :color="type === 'primary' ? 'white' : 'teal'"
    :as="as"
  >
    <FontAwesomeIcon
      :class="['button__icon', 'button__icon--left']"
      :icon="leftIcon"
      v-if="leftIcon"
    />
    <slot />
    <FontAwesomeIcon
      :class="['button__icon', 'button__icon--right']"
      :icon="rightIcon"
      v-if="rightIcon"
    />
  </Typography>
</template>

<script>
import Typography from './Typography';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  name: 'Button',
  components: {
    FontAwesomeIcon,
    Typography,
  },
  props: {
    rightIcon: [String, Array],
    leftIcon: [String, Array],
    disabled: Boolean,
    type: {
      type: String,
      default: () => 'primary',
    },
    htmlType: {
      type: String,
      default: () => 'button',
    },
    color: {
      type: String,
      default: () => 'teal',
    },
    as: {
      type: String,
      default: () => 'button',
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.button {
  @include mixins.transition(background-color);
  padding: calc(#{units.spacing(2)} - 1px) calc(#{units.spacing(4)} - 1px);
  letter-spacing: units.spacing(0.5);
  border-radius: 6px;
  text-decoration: none;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  appearance: none;
  cursor: pointer;

  box-shadow: 0px units.spacing(0.5) units.spacing(1) 0px #00000033;
  background-color: rgb(var(--color));
  border: 1px solid rgb(var(--color));
  text-transform: uppercase;

  &:hover,
  &:focus {
    background-color: colors.css-color('dark-teal');
  }


  &--type--secondary {
    background-color: colors.css-color(white);
    color: colors.css-color('teal');
  }

  &:active {
    background-color: colors.css-color('dark-teal');
    //color: colors.css-color('dark-teal');
  }

  &--type {
    &--secondary {
      &:hover,
      &:focus {
        background-color: colors.css-color('dark-teal');
        color: colors.css-color(white);
      }

      &:active {
        background-color: colors.css-color('dark-teal');
        color: colors.css-color(white);
      }
    }
  }

  @each $color, $_ in colors.$colors {
    &--color--#{$color} {
      --color: var(#{colors.css-var($color)});
    }
  }

  &:disabled,
  &--disabled {
    background-color: colors.css-color('grey');
    border-color: colors.css-color('grey');
    color: colors.css-color(white);
    cursor: not-allowed;
  }

  &__icon {
    width: units.spacing(4);
    height: auto;

    &--right {
      margin-left: units.spacing(3);
    }

    &--left {
      margin-right: units.spacing(3);
    }
  }
}
</style>

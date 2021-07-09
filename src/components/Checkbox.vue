<template>
  <div
    :class="[
      'checkbox',
      disabled && 'checkbox--disabled',
      !!error && 'checkbox--error',
    ]"
  >
    <div class="checkbox__body">
      <input
        class="checkbox__el"
        :id="id"
        :required="required"
        :disabled="disabled"
        type="checkbox"
        v-model="value"
      />
      <div class="checkbox__box">
        <Check :class="[value && 'checkbox__svg--show', 'checkbox__svg']" />
      </div>
    </div>
    <Typography
      class="checkbox__label"
      color="black"
      type="paragraph"
      as="label"
      :for="id"
    >
      <span v-html="label" />{{ required ? '*' : '' }}
    </Typography>
  </div>
</template>

<script>
import { computed } from 'vue';
import Typography from '@/components/Typography';
import Check from '@/assets/check.svg';

export default {
  components: {
    Typography,
    Check,
  },
  props: {
    modelValue: Boolean,
    required: Boolean,
    disabled: Boolean,
    label: String,
    error: String,
    id: {
      type: String,
      default: () => Math.random().toString().slice(-8),
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return {
      value: computed({
        set: (value) => emit('update:modelValue', value),
        get: () => props.modelValue,
      }),
    };
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.checkbox {
  --checkbox-color: var(#{colors.css-var(dark-navy)});
  grid-template-columns: min-content auto;
  grid-gap: units.spacing(6);
  display: grid;
  $self: &;

  &--disabled {
    --checkbox-color: var(#{colors.css-var(disabled)});

    & #{$self}__box {
      background-color: colors.css-color(disabled, $alpha: 0.15);
    }

    & #{$self}__label {
      color: colors.css-color(disabled);
    }
  }

  &--error {
    --checkbox-color: var(#{colors.css-var(error)});

    & #{$self}__box {
      background-color: colors.css-color(error, $alpha: 0.15);
    }

    & #{$self}__label {
      color: colors.css-color(error);
    }
  }

  &__body {
    margin-bottom: auto;
    position: relative;
    display: flex;
  }

  &__el {
    position: absolute;
    cursor: pointer;
    appearance: none;
    border: none;
    height: 100%;
    margin: auto;
    width: 100%;
    z-index: 1;
    inset: 0;

    &:disabled {
      cursor: not-allowed;
    }

    &:not(:disabled):hover ~ #{$self}__box > #{$self}__svg {
      opacity: 0.4;
    }

    &:not(:disabled):active ~ #{$self}__box > #{$self}__svg {
      opacity: 0.6;
    }
  }

  &__box {
    border: 1px solid rgba(var(--checkbox-color), 1);
    color: rgba(var(--checkbox-color), 1);
    border-radius: units.spacing(0.5);
    padding: units.spacing(1);
    height: units.spacing(6);
    justify-content: center;
    width: units.spacing(6);
    box-sizing: border-box;
    align-items: center;
    display: flex;
  }

  &__svg {
    @include mixins.transition(opacity);
    margin-top: units.spacing(0.5);
    display: flex;
    width: 100%;
    opacity: 0;

    &--show {
      opacity: 1 !important;
    }
  }

  &__label {
    pointer-events: none;
  }
}
</style>

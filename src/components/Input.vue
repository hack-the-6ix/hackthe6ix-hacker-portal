<template>
  <div :class="[
      disabled && 'input--disabled',
      error && 'input--error',
      'input',
    ]">
    <Typography
      class="input__label"
      color='dark-navy'
      type='heading4'
      as='label'
      :for="id"
    >
      <span v-html='label'/>{{required ? '*' : ''}}
    </Typography>
    <input
      class="input__el"
      v-model='value'
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :disabled="disabled"
      :name="name"
      :required="required"
      :id="id"
    />
    <Typography v-if='error' type='small' as='p' color='error' class='input__error'>
      {{ error }}
    </Typography>
  </div>
</template>

<script>
import { computed } from 'vue';
import { v4 as uuid } from 'uuid';
import Typography from '@/components/Typography'

export default {
  components: {
    Typography,
  },
  props: {
    autocomplete: String,
    modelValue: String,
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      default: () => uuid().slice(-8),
    },
    placeholder: String,
    required: Boolean,
    disabled: Boolean,
    error: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return {
      value: computed({
        set: value => emit('update:modelValue', value),
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

.input {
  --input-background: transparent;
  --input-color: #{colors.css-color(dark-navy)};
  flex-direction: column;
  display: flex;

  &--disabled {
    --input-background: #{colors.css-color(disabled, $alpha: 0.15)};
    --input-color: #{colors.css-color(disabled)};
  }

  &--error {
    --input-background: #{colors.css-color(error, $alpha: 0.15)};
    --input-color: #{colors.css-color(error)};
  }

  &__label {
    margin-bottom: units.spacing(1);
    color: var(--input-color);
    display: block;
  }

  &__el {
    @include mixins.transition(background-color);

    @each $tag, $val in map-get(units.$font-config, paragraph) {
      #{$tag}: $val;
    }

    &:disabled {
      color: var(--input-color);
      cursor: not-allowed;
    }

    background-color: var(--input-background);
    padding: units.spacing(2) units.spacing(3);
    border: 1px solid var(--input-color);
    border-radius: units.spacing(0.5);
    color: colors.css-color(black);
    font-family: units.$font;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
  }

  &__error {
    margin-top: units.spacing(1);
  }
}
</style>
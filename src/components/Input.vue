<template>
  <FieldLayout
    :required="required"
    :disabled="disabled"
    :error="error"
    :label="label"
    :id="id"
  >
    <input
      :class="[error && 'input__el--error', 'input__el']"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      v-model="value"
      :name="name"
      :id="id"
      :maxlength="maxlength"
    />
  </FieldLayout>
</template>

<script>
import { v4 as uuid } from 'uuid';
import { computed } from 'vue';
import FieldLayout from '@/components/FieldLayout';

export default {
  components: {
    FieldLayout,
  },
  props: {
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
    autocomplete: String,
    placeholder: String,
    modelValue: String,
    required: Boolean,
    disabled: Boolean,
    error: String,
    maxlength: Number,
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

.input {
  &__el {
    @include mixins.transition(background-color);

    @each $tag, $val in map-get(units.$font-config, paragraph) {
      #{$tag}: $val;
    }

    background-color: var(--field-layout__background);
    padding: units.spacing(2) units.spacing(3);
    color: colors.css-color(black);
    font-family: units.$font;
    box-sizing: border-box;
    border: none;
    width: 100%;
    margin: 0;

    &--error {
      padding-right: units.spacing(6.75);
    }

    &:disabled {
      -webkit-text-fill-color: var(--field-layout__color);
      color: var(--field-layout__color);
      cursor: not-allowed;
      opacity: 1;
    }
  }
}
</style>

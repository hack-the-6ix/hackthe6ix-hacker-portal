<template>
  <FieldLayout
    :required="required"
    :disabled="disabled"
    :error="error"
    :label="label"
    :info="lowerCaption"
    :id="id"
  >
    <textarea
      v-model="value"
      class="textArea__el"
      :disabled="disabled"
      :name="name"
      :required="required"
      :id="id"
      :rows="rows"
      :maxLength="maxLength"
    />
  </FieldLayout>
</template>

<script>
import { computed } from 'vue';
import { v4 as uuid } from 'uuid';
import FieldLayout from '@/components/FieldLayout';

export default {
  components: {
    FieldLayout,
  },
  props: {
    modelValue: String,
    lowerCaption: String,
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
    rows: Number,
    maxLength: Number,
    required: Boolean,
    disabled: Boolean,
    success: Boolean,
    error: String,
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

.textArea {
  &__el {
    @include mixins.transition(background-color);

    @each $tag, $val in map-get(units.$font-config, paragraph) {
      #{$tag}: $val;
    }

    background-color: var(--field-layout__background);
    padding: units.spacing(2) units.spacing(2);
    border-radius: units.spacing(0.5);
    color: colors.css-color(black);
    font-family: units.$font;
    box-sizing: border-box;
    display: flex;
    resize: vertical;
    border: none;
    width: 100%;
    margin: 0;

    &:disabled {
      color: var(--field-layout__color);
    }
  }
}
</style>

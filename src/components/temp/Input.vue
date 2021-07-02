<template>
  <div class="input">
    <label
      class="input__label"
      :v-show="showLabel"
      :for="id"
    >
    <Typography v-if='!this.modelValue' type='heading4' as='p' color='dark-navy'>
      {{ label }}
    </Typography>
    </label>
    <input
      :class="[
        success && 'input__el--success',
        error && 'input__el--error',
        'input__el',
      ]"
      v-model='value'
      :type='text'
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      :name="name"
      :required="required"
      :id="id"
    />
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
    modelValue: String,
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: () => 'text',
    },
    id: {
      type: String,
      default: () => uuid().slice(-8),
    },
    placeholder: String,
    showLabel: Boolean,
    required: Boolean,
    disabled: Boolean,
    readOnly: Boolean,
    success: Boolean,
    error: Boolean,
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
  display: flex;
  flex-direction: column;

  &__label {
    @each $t, $v in map-get(units.$font-config, small) {
      #{$t}: $v;
    }
    font-weight: 700;
    margin-bottom: units.spacing(1);
  }

  &__el {
    @include mixins.transition(background-color);

    @each $tag, $val in map-get(units.$font-config, paragraph) {
      #{$tag}: $val;
    }

    &--error {
      border: 1px solid colors.css-color(error, $alpha: 0.3);
      background-color: colors.css-color(error, $alpha: 0.3);
    }

    &--success {
      border: 1px solid colors.css-color(success, $alpha: 0.3);
      background-color: colors.css-color(success, $alpha: 0.3);
    }

    background-color: colors.css-color(white);
    padding: units.spacing(2) units.spacing(2);
    border-radius: units.spacing(0.5);
    color: colors.css-color(black);
    font-family: units.$font;
    box-sizing: border-box;
    resize: vertical;
    border: 1px solid colors.css-color('dark-navy');
    width: 100%;
    margin: 0;
  }
}
</style>
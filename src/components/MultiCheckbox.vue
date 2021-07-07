<template>
  <div :class="['multicheck', disabled && 'multicheck--disabled']">
    <Typography
      class="multicheck__label"
      type="heading4"
      as="p"
      color="dark-navy"
    >
      <span v-html="label" />{{ required ? '*' : '' }}
    </Typography>
    <ul class="multicheck__options">
      <li v-for="option in options" :key="option.value">
        <Checkbox
          @update:modelValue="selected[option.value] = !selected[option.value]"
          :modelValue="selected[option.value]"
          :label="option.label"
          :disabled="disabled || (isMaxed && !selected[option.value])"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue';
import Typography from '@/components/Typography';
import Checkbox from '@/components/Checkbox';

export default {
  components: {
    Typography,
    Checkbox,
  },
  data() {
    return {
      selected: {},
    };
  },
  computed: {
    isMaxed() {
      return Object.keys(this.selected).length === this.limit;
    },
  },
  props: {
    modelValue: Array,
    required: Boolean,
    disabled: Boolean,
    options: Array,
    label: String,
    limit: {
      type: Number,
      default: () => 999,
    },
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
@use '@/styles/colors';
@use '@/styles/units';

.multicheck {
  $self: &;

  &--disabled {
    & #{$self}__label {
      color: colors.css-color(dark-disabled);
    }
  }

  &__options {
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: units.spacing(6.5);
    margin: units.spacing(3) 0 0;
    list-style-type: none;
    display: grid;
    padding: 0;
  }
}
</style>

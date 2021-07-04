<template>
  <div :class='[
    error && "select--error",
    disabled && "selected--disabled",
    "select",
  ]'>
    <Typography class='select__label' type='heading4' as='p' color='dark-navy'>
      <span v-html='label'/>{{required ? '*' : ''}}
    </Typography>
    <div class='select__main'>
      <select class='select__el' :disabled='disabled' v-model='value'>
        <option v-if='placeholder' value='' selected disabled hidden>
          {{ placeholder }}
        </option>
        <option
          v-for='option in options'
          :value='option.value'
          :key='option.value'
        >
          {{option.label }}
        </option>
      </select>
      <Typography
        type='paragraph'
        as='button'
        tabindex='-1'
        color='black'
        htmlType='button'
        :class='[
        !selectedLabel && "select__display--placeholder",
        "select__display",
      ]'>
        {{ selectedLabel ?? placeholder }}
      </Typography>
    </div>
    <ul v-if='showMenu' class='select__menu'>
      <li v-for='option in options' :key='option.value'>
        <button class='select__menu-item' @click='value = option.value'>
          {{ option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed }from 'vue';
import Typography from '@/components/Typography';

export default {
  name: 'Select',
  components: {
    Typography,
  },
  data() {
    return {
      showMenu: false,
    };
  },
  props: {
    modelValue: String,
    label: String,
    required: Boolean,
    options: Array,
    placeholder: String,
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
  computed: {
    selectedLabel() {
      return this.options.find(
        option => option.value === this.value
      )?.label;
    },
  },
}
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.select {
  $self: &;

  &__label {
    margin-bottom: units.spacing(1);
  }

  &__main {
    position: relative;
    display: flex;
  }

  &__display {
    border: 1px solid colors.css-color(dark-navy);
    padding: units.spacing(2) units.spacing(3);
    border-radius: units.spacing(0.5);
    background: transparent;
    box-sizing: border-box;
    text-align: start;
    width: 100%;

    &--placeholder {
      color: colors.css-color(disabled);
    }
  }

  &__el {
    @each $tag, $val in map-get(units.$font-config, 'paragraph') {
      #{$tag}: $val;
    }

    padding: units.spacing(2) units.spacing(3);
    letter-spacing: units.spacing(0.25);
    border-radius: units.spacing(0.5);
    border: 1px solid transparent;
    font-family: units.$font;
    background: transparent;
    box-sizing: border-box;
    position: absolute;
    color: transparent;
    appearance: none;
    margin: auto;
    width: 100%;
    z-index: 2;
    inset: 0;
  }

  &__menu {

  }

  &__menu-item {

  }
}
</style>
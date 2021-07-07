<template>
  <FieldLayout
    :required='required'
    :disabled='disabled'
    :error='error'
    :label='label'
    :id='id'
  >
    <div class='select'>
      <select class='select__el' v-model='value'>
        <option
          v-for='option in options'
          :value='option.value'
          :key='option.value'
        >
          {{option.label}}
        </option>
      </select>
      <Typography
        :class='[
          !selectedLabel && "select__display--placeholder",
          disabled && "select__display--disabled",
          error && "select__display--error",
          "select__display",
        ]'
        @click='showMenu = !showMenu'
        htmlType='button'
        type='paragraph'
        tabindex='-1'
        color='black'
        as='button'
      >
        <span class='select__text'>
          {{ selectedLabel ?? placeholder }}
        </span>
        <Caret :class='[
          showMenu && "select__caret--flip",
          !error || "select__caret--hide",
          "select__caret",
        ]'/>
      </Typography>
      <ul v-if='showMenu' class='select__menu'>
        <li
          v-for='option in options'
          :key='option.value'
        >
          <Typography
            :class='[
              value === option.value && "select__menu-item--active",
              "select__menu-item",
            ]'
            @click='value = option.value'
            htmlType='button'
            type='paragraph'
            color='dark-navy'
            as='button'
          >
            {{ option.label }}
          </Typography>
        </li>
      </ul>
    </div>
  </FieldLayout>
</template>

<script>
import { computed }from 'vue';
import FieldLayout from '@/components/FieldLayout';
import Typography from '@/components/Typography';
import Caret from '@/assets/caret.svg';

export default {
  name: 'Select',
  components: {
    FieldLayout,
    Typography,
    Caret,
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
  watch: {
    value() {
      this.showMenu = false;
    },
  },
}
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.select {
  position: relative;

  &__el {
    position: absolute;
    color: transparent;
    appearance: none;
    background: none;
    border: none;
    z-index: -1;
    width: 100%;
    inset: 0;

    @media (hover: none) {
      z-index: 1;
    }
  }

  &__display {
    @each $tag, $val in map-get(units.$font-config, paragraph) {
      #{$tag}: $val;
    }

    grid-template-columns: auto units.spacing(3);
    padding: units.spacing(2) units.spacing(3);
    color: colors.css-color(black);
    grid-gap: units.spacing(3);
    background: transparent;
    align-items: center;
    text-align: start;
    cursor: pointer;
    display: grid;
    border: none;
    width: 100%;

    &--disabled {
      color: var(--field-layout__color);
      cursor: not-allowed;
    }

    &--placeholder {
      color: colors.css-color(disabled);
    }
  }

  &__text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__caret {
    @include mixins.transition(transform);
    color: colors.css-color(dark-navy);

    &--flip {
      transform: rotate(180deg);
    }

    &--hide {
      opacity: 0;
    }
  }

  &__menu {
    border: 1px solid colors.css-color(dark-navy);
    background-color: colors.css-color(white);
    border-radius: units.spacing(0.5);
    max-height: units.spacing(40);
    margin: units.spacing(2) 0 0;
    list-style-type: none;
    height: fit-content;
    position: absolute;
    inset: 100% 0 0;
    overflow: auto;
    z-index: 2;
    padding: 0;
  }

  &__menu-item {
    @include mixins.transition(background-color);
    background-color: transparent;
    padding: units.spacing(3);
    text-align: start;
    cursor: pointer;
    display: block;
    border: none;
    width: 100%;

    &--active, &:hover, &:focus {
      background-color: colors.css-color(disabled, $alpha: 0.1);
    }

    &:active {
      background-color: colors.css-color(disabled, $alpha: 0.15);
    }
  }
}
</style>
<template>
  <FieldLayout
    :required="required"
    :disabled="disabled"
    :error="error"
    :label="label"
    :id="id"
  >
    <input
      @focus="showOptions = !disabled && true"
      @blur="reset"
      :placeholder="placeholder"
      v-model="displayText"
      :disabled="disabled"
      :required="required"
      class="combobox__el"
      :name="name"
      :id="id"
    />
    <ul ref="list" class="combobox__options" v-if="showOptions && (!hideDropdownUntilType || displayText?.length > 0)">
      <li v-for="option in filteredOptions" :key="option">
        <Typography
          @click="setValue(option)"
          class="combobox__option"
          htmlType="button"
          color="dark-navy"
          type="paragraph"
          as="button"
        >
          {{ option }}
        </Typography>
      </li>
      <li v-if="!disallowCustom">
        <Typography
          @click="setValue(displayText)"
          class="combobox__option"
          htmlType="button"
          color="dark-navy"
          type="paragraph"
          as="button"
        >
          Add custom: "{{ displayText }}"
        </Typography>
      </li>
    </ul>
  </FieldLayout>
</template>

<script>
import stringSimilarity from 'string-similarity';
import { v4 as uuid } from 'uuid';
import { computed } from 'vue';
import FieldLayout from '@/components/FieldLayout';
import Typography from '@/components/Typography';

export default {
  components: {
    FieldLayout,
    Typography,
  },
  data() {
    return {
      displayText: this.value,
      showOptions: false,
      changed: false,
    };
  },
  watch: {
    value(text) {
      this.displayText = text;
    },
    displayText() {
      this.$refs?.list?.scrollTo(0, 0);
    },
  },
  methods: {
    setValue(value) {
      this.value = value;
      this.showOptions = false;
    },
    reset(event) {
      if (!this.$el.contains(event.relatedTarget)) {
        this.displayText = this.value;
        this.showOptions = false;
      }
    },
  },
  computed: {
    normalizedOptions() {
      return this.options.reduce((acc, option) => {
        acc[option.toLowerCase()] = option;
        return acc;
      }, {});
    },
    filteredOptions() {
      if (this.displayText.length < 3) return this.options.slice(0, 10);

      return (
        stringSimilarity
          .findBestMatch(
            this.displayText.toLowerCase(),
            Object.keys(this.normalizedOptions),
          )
          .ratings// More we type, stricter the search
          .filter(
            (rating) =>
              rating.rating >=
              Math.min(0.1 + this.displayText.length * 0.03, 0.8),
          )
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10)
          .map((rating) => this.normalizedOptions[rating.target])
      );
    },
  },
  props: {
    hideDropdownUntilType: Boolean,
    disallowCustom: Boolean,
    modelValue: String,
    label: String,
    required: Boolean,
    options: Array,
    placeholder: String,
    disabled: Boolean,
    error: String,
    name: String,
    id: {
      type: String,
      default: () => uuid().slice(-8),
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

.combobox {
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

    &:disabled {
      -webkit-text-fill-color: colors.css-color(disabled);
      color: colors.css-color(disabled);
      cursor: not-allowed;
      opacity: 1;
    }
  }

  &__options {
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
    width: 100%;
    padding: 0;
    z-index: 1;
  }

  &__option {
    @include mixins.transition(background-color);
    background-color: transparent;
    padding: units.spacing(3);
    text-align: start;
    cursor: pointer;
    display: block;
    border: none;
    width: 100%;

    &:hover,
    &:focus,
    &--active {
      background-color: colors.css-color(disabled, $alpha: 0.1);
    }

    &:active {
      background-color: colors.css-color(disabled, $alpha: 0.15);
    }
  }
}
</style>

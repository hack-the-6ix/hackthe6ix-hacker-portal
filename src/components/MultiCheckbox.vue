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
          @update:modelValue="selected(option.value, $event)"
          :modelValue="selectedArray.includes(option.value)"
          :label="option.label"
          :disabled="disabled || (isMaxed && !selectedArray.includes(option.value))"
        />
      </li>
    </ul>
  </div>
</template>

<script>
// import { computed } from 'vue';
import Typography from '@/components/Typography';
import Checkbox from '@/components/Checkbox';

export default {
  components: {
    Typography,
    Checkbox,
  },
  data() {
    return {
    };
  },
  computed: {
    isMaxed() {
      return this.selectedArray.length >= this.limit;
    },
    selectedArray() {
      return !this.modelValue ? [] :  this.modelValue.split(",").sort()
    }
  },
  props: {
    modelValue: String,
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
  setup(props, context) {
    const selected = (optionId, checked) => {
      let updatedValue = !props.modelValue ? [] : props.modelValue.split(",");
      if (checked) {
        updatedValue.push(optionId);
      } else {
        updatedValue.splice(updatedValue.indexOf(optionId), 1);
      }
      context.emit("update:modelValue", updatedValue.sort().join(","));
    };

    return {
      selected,
    };
  }
  // setup(props) {
  //   const selected = {};
  //   for (const ele of props.modelValue.split(",")){
  //     if(ele !== ""){
  //       selected[ele] = true;
  //     }
  //   }
  //   return {
  //     selected
  //   }
  // },
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
    grid-template-columns: 1fr 1fr;
    grid-gap: units.spacing(6.5);
    margin: units.spacing(3) 0 0;
    list-style-type: none;
    display: grid;
    padding: 0;
  }
}
</style>

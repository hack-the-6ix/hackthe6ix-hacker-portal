<template>
  <div class="radio">
    <label>
      <Typography type='heading4' as='p' color='dark-navy'>
        {{ label }}
      </Typography>
    </label>
    <ul class='radio__options'>
      <li v-for='option in options' :key='option.value'>
        <input
          type='radio'
          :name='name'
          :value='option.value'
          :disabled='disabled'
          v-model='value'/>
        <Typography class='radio__option' type='small' as='p' color='dark-navy'>
          {{ option.label }}
        </Typography>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue';
import Typography from '@/components/Typography';

export default {
  components: {
    Typography
  },
  props: {
    modelValue: Object,
    options: Array,
    label: String,
    name: String,
    disabled: Boolean
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
@use '@/styles/units';
@use '@/styles/colors';

.radio {
  $self: &;

  &--disabled {
    & #{$self}__label {
      color: colors.css-color(dark-grey);
    }
  }

  &__options {
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: units.spacing(2);
    list-style-type: none;
    display: grid;
    padding: 0;
    margin: 0;
  }

  &__option {
    float: right;
    display: flex;
  }
}
</style>
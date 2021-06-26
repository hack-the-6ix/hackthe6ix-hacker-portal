<template>
  <div>
    <p>{{ label }}</p>
    <ul class='radio__options'>
      <li v-for='option in options' :key='option.value'>
        <input type='radio' :name='name' :value='option.value' v-model='value'/>
        <label>{{ option.label }}</label>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: ['modelValue', 'options', 'label', 'name'],
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

.radio {
  &__options {
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: units.spacing(6);
    list-style-type: none;
    display: grid;
    padding: 0;
    margin: 0;
  }
}
</style>
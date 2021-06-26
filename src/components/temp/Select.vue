<template>
  <select v-model='value'>
    <option v-if='placeholder' value='' disabled selected hidden>
      {{ placeholder }}
    </option>
    <option
      v-for='({ label, ...props }) in options'
      :key='props.value'
      v-bind='props'
    >
      {{ label }}
    </option>
  </select>
</template>

<script>
import { computed } from 'vue';

export default {
  props: [
    'placeholder',
    'modelValue',
    'options',
  ],
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
<template>
  <input type='file'/>
</template>

<script>
import { computed } from 'vue';

export default {
  props: ['modelValue'],
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
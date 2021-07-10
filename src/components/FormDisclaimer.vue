<template>
  
</template>

<script>
import Typography from '@/components/Typography';
import Close from '@/assets/close.svg';

export default {
  components: {
    Typography,
    Close,
  },
  props: {
    disabled: Boolean,
    error: Boolean,
    type: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/colors';
@use '@/styles/units';

.form-disclaimer {

}
</style>

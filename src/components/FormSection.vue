<template inherit-attrs='false'>
  <div class='form-section'>
    <fieldset class='form-section__content'>
      <legend class='form-section__legend'>
        {{label}}
      </legend>
      <div v-bind='$attrs'>
        <slot/>
      </div>
    </fieldset>
  </div>
</template>

<script>
export default {
  name: 'FormSection',
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      required: true,
    }
  }
}
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/units';

.form-section {
  padding: units.spacing(18) units.spacing(12);
  box-sizing: border-box;

  @include mixins.media(phone) {
    padding: units.spacing(12) units.spacing(8);
  }

  &__content {
    max-width: units.spacing(180);
    margin: 0 auto;
    border: none;
    width: 100%;
    padding: 0;
  }

  &__legend {
    display: none;
  }
}
</style>
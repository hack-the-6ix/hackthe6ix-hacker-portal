<template>
  <div class="form-section">
    <fieldset class="form-section__content">
      <legend class="form-section__legend">
        {{ label }}
      </legend>
      <FormDisclaimer
        class="form-section__disclaimer"
        :type='disclaimerType'
        :data='disclaimer'
        v-if='disclaimer'
      />
      <div v-bind="$attrs">
        <slot />
      </div>
    </fieldset>
  </div>
</template>

<script>
import FormDisclaimer from '@/components/FormDisclaimer';

export default {
  name: 'FormSection',
  inheritAttrs: false,
  components: {
    FormDisclaimer,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    disclaimer: Array,
    disclaimerType: {
      type: String,
      default: () => 'error',
    },
  },
};
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

  &__disclaimer {
    margin-bottom: units.spacing(6);
  }
}
</style>

<template>
  <div
    :class="[
      disabled && 'form-disclaimer--disabled',
      error && 'form-disclaimer--error',
      'form-disclaimer',
    ]"
  >
    <Close />

    <div class="form-disclaimer__content">
      <SuccessIcon class="form-disclaimer__success-icon" />
      <ErrorIcon v-if="error" class="form-disclaimer__error-icon" />
      <DisableIcon v-if="disabled" class="form-disclaimer__disable-icon" />

      <Typography
        class="form-disclaimer__label"
        color="black"
        type="heading4"
        as="label"
      >
        All the fields have been filled in correctly
      </Typography>
      <Typography
        v-if="error"
        class="form-disclaimer__label"
        color="black"
        type="heading4"
        as="label"
      >
        Please resolve the following before proceeding on to the next page. 
      </Typography>
      <Typography
        v-if="disabled"
        class="form-disclaimer__label"
        color="black"
        type="heading4"
        as="label"
      >
        Please complete the previous section to edit this page. 
      </Typography>
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';
import SuccessIcon from '@/assets/success-circle.svg';
import ErrorIcon from '@/assets/error-circle.svg';
import DisableIcon from '@/assets/disabled-circle.svg';
import Close from '@/assets/close.svg';

export default {
  components: {
    Typography,
    SuccessIcon,
    ErrorIcon,
    DisableIcon,
    Close
  },
  props: {
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
  --form-disclaimer__color: #{colors.css-color(success)};
  --form-disclaimer__background: #{colors.css-color(success, $alpha: 0.15)};
  display: block;

  &--error {
    --form-disclaimer__color: #{colors.css-color(error)};
    --form-disclaimer__background: #{colors.css-color(error, $alpha: 0.15)};
  }

  &--disabled {
    --form-disclaimer__color: #{colors.css-color(disabled)};
    --form-disclaimer__background: #{colors.css-color(disabled, $alpha: 0.15)};
  }

  &__label {
    color: var(--form-disclaimer__color);
  }

  border: 1px solid var(--form-disclaimer__color);
  background-color: var(--form-disclaimer__background);
}

</style>
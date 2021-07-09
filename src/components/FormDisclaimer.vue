<template>
  <div
    :class="[
      disabled && 'form-disclaimer--disabled',
      error && 'form-disclaimer--error',
      'form-disclaimer',
    ]"
  >
    <button @click="$emit('close')" class="form-disclaimer__close" type="button">
      <Close />
    </button>

    <div class="form-disclaimer__body">
      <slot name="body">

        <SuccessIcon class="form-disclaimer__icon" />
        <ErrorIcon v-if="error" class="form-disclaimer__icon" />
        <DisableIcon v-if="disabled" class="form-disclaimer__icon" />

        <div class="form-disclaimer__details">
          <Typography
            class="form-disclaimer__label"
            color="black"
            type="heading4"
            as="label"
          >
            All the fields have been filled in correctly
          </Typography>
        </div>
        <div class="form-disclaimer__details">
          <Typography
            v-if="error"
            class="form-disclaimer__label"
            color="black"
            type="heading4"
            as="label"
          >
            Please resolve the following before proceeding on to the next page. 
          </Typography>
          <ul
            v-if="error" 
            class="form-disclaimer__error"
          >
          <Typography
            class="form-disclaimer__points"
            color="error"
            type="heading4"
            as="a"
          >
            <li><a href="#">About You</a></li>
          </Typography>
          </ul>
        </div>
        <div class="form-disclaimer__details">
          <Typography
            v-if="disabled"
            class="form-disclaimer__label"
            color="black"
            type="heading4"
            as="a"
          >
            Please complete the previous section to edit this page. 
          </Typography>
          <ul 
            v-if="disabled"
            class="form-disclaimer__disabled"
          >
            <Typography
              v-if="error"
              class="form-disclaimer__points"
              color="navy"
              type="heading4"
              as="label"
            >
              <li><a href="#">About You</a></li>
            </Typography>
          </ul>
        </div>
      </slot>
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
  --form-disclaimer__color: #{colors.css-color(success)};
  --form-disclaimer__background: #{colors.css-color(success, $alpha: 0.15)};
  display: grid;
  grid-template-columns: 1fr;
  position: relative;

  &--error {
    --form-disclaimer__color: #{colors.css-color(error)};
    --form-disclaimer__background: #{colors.css-color(error, $alpha: 0.15)};
  }

  &--disabled {
    --form-disclaimer__color: #{colors.css-color(disabled)};
    --form-disclaimer__background: #{colors.css-color(disabled, $alpha: 0.15)};
  }

  &__close {
    position: absolute;
    right: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  &__body {
    display: grid;
    grid-template-columns: 20% 80%;
    grid-gap: units.spacing(2);
    padding-top: units.spacing(10);
    margin-right: units.spacing(10);
    padding-bottom: units.spacing(10);
  }

  &__icon {
    padding-left: units.spacing(6);
  }

  &__label {
    color: colors.css-color(black);
  }

  &__error, &__disabled {
    list-style-position: inside;
    padding-left: 0;
  }

  border-left: 4px solid var(--form-disclaimer__color);
  background-color: var(--form-disclaimer__background); 
}

</style>
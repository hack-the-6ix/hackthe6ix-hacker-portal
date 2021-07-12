<template>
  <div class="info-prompt">
    <button @click="$emit('close')" class="info-prompt__close" type="button">
      <Close />
    </button>
    <div class="info-prompt__body">
      <slot name="body">
        <Typography
          class="info-prompt__label"
          color="black"
          type="paragraph"
          as="p"
        >
          This question allows us to gauge our hackathon's commitment to
          diversity and inclusion where we can equitably work towards a better
          and inclusive hacking community for everyone. We at Hack the 6ix
          believe that diversity delivers a unique array of ideas and is a key
          ingredient for better decision-making among teams.
        </Typography>
      </slot>
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';
import Close from '@/assets/close.svg';

export default {
  inheritAttrs: false,
  components: {
    Typography,
    Close,
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

.info-prompt {
  --info-prompt__color: #{colors.css-color('grey')};
  --info-prompt__background: colors.css-color('white');
  display: block;
  position: relative;

  &__close {
    position: absolute;
    top: 0;
    right: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  &__body {
    padding: units.spacing(10) units.spacing(6) units.spacing(7) units.spacing(8);
    background-color: var(--info-prompt__background);
  }

  background-color: var(--info-prompt__background);
  border: 1px solid var(--info-prompt__color);
}
</style>

<template>
  <div class="message">
    <button @click="$emit('close')" class="message__close" type="button">
      <Close />
    </button>

    <div class="message__body">
      <slot name="body">
        <Typography
          class="message__label"
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

.message {
  --message__color: #{colors.css-color('grey')};
  --message__background: transparent;
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
    padding: units.spacing(10) units.spacing(12) units.spacing(10)
      units.spacing(12);
  }

  border: 1px solid var(--message__color);
  background-color: var(--message__background);
}
</style>

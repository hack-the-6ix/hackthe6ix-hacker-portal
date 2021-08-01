<template>
  <div class="resources">
    <div class="resources__content">
      <Typography
        color="dark-navy"
        transform="uppercase"
        type="heading3"
        as="h1"
      >
        Notion
      </Typography>
      <iframe
        class="resources__notion"
        allowtransparency
        frameborder="0"
        src="https://hackthe6ix2021.notion.site/hackthe6ix2021/Hack-the-6ix-Hacker-Guide-12ce5072583f487cac5c6e2bb128b599"
      />
    </div>
  </div>
</template>

<script>
import Typography from "@/components/Typography";

export default ({
  components: {
    Typography
  }
})
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.resources {
  padding: units.spacing(16);
  $self: &;

  @include mixins.media(phone) {
    padding: units.spacing(16) units.spacing(12);
  }

  &__content {
    max-width: 900px;
    margin: 0 auto;
  }

  &__notion {
    background: colors.css-color(gray);
    border-radius: units.spacing(3);
    margin-top: units.spacing(5);
    height: units.spacing(200);
    width: 100%;
  }
}

</style>

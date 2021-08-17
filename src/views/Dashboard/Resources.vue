<template>
  <div class="resources">
    <div class="resources__content">
      <div class="resources__header">
        <Typography
          color="dark-navy"
          transform="uppercase"
          type="heading3"
          as="h1"
        >
          Notion
        </Typography>
        <Button as="a" :href="notion" target="_blank" rel="noopener noreferrer">
          Open link
        </Button>
      </div>
      <iframe
        class="resources__notion"
        allowtransparency
        frameborder="0"
        :src="notionFrame"
      />
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';
import Button from '@/components/Button';

export default {
  components: {
    Typography,
    Button,
  },
  computed: {
    notion() {
      return 'https://hackthe6ix2021.notion.site/hackthe6ix2021/Hack-the-6ix-Hacker-Guide-12ce5072583f487cac5c6e2bb128b599';
    },
    notionFrame() {
      return 'https://ht6-notion.netlify.app/12ce5072583f487cac5c6e2bb128b599';
    },
  },
};
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

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__content {
    max-width: units.spacing(225);
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

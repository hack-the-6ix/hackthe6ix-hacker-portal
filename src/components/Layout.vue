<template>
  <main class="layout">
    <div class="layout__content">
      <template v-if="!loading">
        <header class="layout__header" v-if="title || description">
          <Typography type="heading1" v-if="title">
            {{ title }}
          </Typography>
          <Typography type="heading4" as="p" weight="400" v-if="description">
            {{ description }}
          </Typography>
        </header>
        <slot />
      </template>
      <slot v-else name="fallback">
        <header class="layout__header">
          <Typography class="layout__loading" type="heading2">
            Loading...
          </Typography>
        </header>
      </slot>
    </div>
  </main>
</template>

<script>
import Typography from '@/components/Typography';

export default {
  name: 'Layout',
  components: {
    Typography,
  },
  props: {
    title: String,
    description: String,
    loading: Boolean,
  },
};
</script>

<style lang="scss">
@use '@/styles/units';

.layout {
  padding: units.spacing(18) units.spacing(12);

  &__content {
    max-width: units.spacing(320);
    margin: 0 auto;
  }

  &__header {
    margin-bottom: units.spacing(15);
    grid-template-columns: 1fr;
    grid-gap: units.spacing(4);
    display: grid;
  }

  &__loading {
    animation: load 2s ease infinite;
    @keyframes load {
      0% {
        opacity: 0.8;
      }
      40% {
        opacity: 0.3;
      }
      60% {
        opacity: 0.3;
      }
      100% {
        opacity: 0.8;
      }
    }
  }
}
</style>

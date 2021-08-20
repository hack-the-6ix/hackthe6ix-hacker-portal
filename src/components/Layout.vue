<template>
  <div class="app">
    <Logo width="24" class="app__logo" />
    <span>
      <Typography color="teal" type="heading3" as="span" transform="uppercase">
        HT6
      </Typography>
      <Typography
        color="yellow"
        type="heading3"
        as="span"
        transform="uppercase"
      >
        Digital
      </Typography>
    </span>
    <span style="margin-left: auto">
      <Button color="black" @click="confirmRunLogout">Sign Out</Button>
    </span>
  </div>
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
import Button from '@/components/Button';
import swal from 'sweetalert';
import { runLogout } from "../utils/SessionController";

export default {
  name: 'Layout',
  components: {
    Typography,
    Button,
  },
  props: {
    title: String,
    description: String,
    loading: Boolean,
  },
  methods: {
    confirmRunLogout() {
      swal({
        title: 'Confirm Sign Out',
        text: 'Are you sure you want to sign out?',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (confirm) => {
        if (confirm) {
          await runLogout();
        }
      });
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/units';

.layout {
  padding: units.spacing(18) units.spacing(12);

  &__content {
    max-width: units.spacing(380);
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

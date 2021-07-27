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
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <keep-alive>
        <suspense>
          <component :is="Component"></component>
          <template #fallback>
            <Typography color="white" type="heading3" as="h1">
              Loading...
            </Typography>
          </template>
        </suspense>
      </keep-alive>
    </template>
  </router-view>
</template>

<script>
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import Logo from '@/assets/icon.svg';
import swal from 'sweetalert';
import { runLogout } from './utils/SessionController';

export default {
  name: 'App',
  mounted() {
    window.requestAnimationFrame(() => {
      document.body.classList.add('animate');
    });
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
  components: {
    Typography,
    Logo,
    Button,
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

@include colors.init();

html {
  background: linear-gradient(88.96deg, #002c37 1.77%, #004d57 95.9%);
  font-family: units.$font;

  @include mixins.media(tablet) {
    font-size: 14px;
  }

  @include mixins.media(phone) {
    font-size: 12px;
  }
}

body {
  margin: 0;
}

.app {
  padding: units.spacing(5) units.spacing(6);
  align-items: center;
  display: flex;

  &__logo {
    margin-right: units.spacing(4);
  }
}

@include colors.deferInit();
</style>

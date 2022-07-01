<template>
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

export default {
  name: 'App',
  mounted() {
    window.requestAnimationFrame(() => {
      document.body.classList.add('animate');
    });
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
  background-image: url('./assets/backdrop.png');
  background-size: cover;
  background-position: center 30%;
  background-repeat: no-repeat;
  font-family: units.$font;

  @include mixins.media(tablet) {
    font-size: 14px;
  }

  @include mixins.media(phone) {
    font-size: 12px;
  }

  min-height: 100%;
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

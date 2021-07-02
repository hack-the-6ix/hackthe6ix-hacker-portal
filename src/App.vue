<template>
  <div class='app'>
    <Logo width='24' class='app__logo'/>
    <span>
      <Typography color='teal' type='heading3' as='span' transform='uppercase'>
        HT6
      </Typography>
      <Typography color='yellow' type='heading3' as='span' transform='uppercase'>
        Digital
      </Typography>
    </span>
  </div>
  <router-view/>
</template>

<script>
import Typography from '@/components/Typography';
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
  },
}
</script>

<style lang="scss">
@use '@/styles/colors';
@use '@/styles/units';

@include colors.init();

html {
  background: linear-gradient(88.96deg, #002C37 1.77%, #004D57 95.9%);
}

.app {
  padding: units.spacing(2.5) units.spacing(6) ;
  align-items: center;
  display: flex;

  &__logo {
    margin-right: units.spacing(4);
  }
}

@include colors.deferInit();
</style>
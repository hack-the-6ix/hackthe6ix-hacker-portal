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
    <span style="margin-left: auto">
      <Button color="black" @click="triggerLogout">
        Sign Out
      </Button>
    </span>
  </div>
  <router-view/>
</template>

<script>
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import Logo from '@/assets/icon.svg';
import swal from 'sweetalert';
import {runLogout} from "./utils/SessionController";

export default {
  name: 'App',
  mounted() {
    window.requestAnimationFrame(() => {
      document.body.classList.add('animate');
    });
  },
  methods: {
    triggerLogout() {
      swal({
        title: "Confirm Sign Out",
        text: "Are you sure you want to sign out?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then(async (willDelete) => {
        if (willDelete) {
          await runLogout();
        }
      });
    }
  },
  components: {
    Typography,
    Logo,
    Button
  },
}
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

@include colors.init();

html {
  background: linear-gradient(88.96deg, #002C37 1.77%, #004D57 95.9%);
  font-family: units.$font;

  @include mixins.media(tablet) {
    font-size: 14px;
  }

  @include mixins.media(phone) {
    font-size: 12px;
  }
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

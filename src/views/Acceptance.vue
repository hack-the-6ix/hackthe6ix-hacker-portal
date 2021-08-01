<template>
  <Layout :loading="loading">
    <div class="acceptance">
      <div class="acceptance__content">
        <Typography type="heading4" color="dark-grey" as="p">
          Hack the 6ix 2021
        </Typography>
        <Typography
          class="acceptance__heading"
          type="heading2"
          color="dark-navy"
          as="h1"
        >
          Hacker Invitation
        </Typography>
        <template v-if="canConfirm">
          <Typography type="heading4" color="black" as="p">
            Congratulations and welcome to Hack the 6ix 2021! We are excited to
            offer you the opportunity to hack with us! To confirm your
            attendance, please RSVP below!
          </Typography>
          <div class="acceptance__buttons">
            <Button @click="accept"> Accept Invitation </Button>
            <Button @click="decline" type="secondary"> Decline </Button>
          </div>
        </template>
        <Typography v-else type="heading4" color="black" as="p">
          Looks like the confirmation period has passed. If this is a mistake,
          or you wish to confirm past this period - please contact us at
          <a class="acceptance__link" href="mailto:hello@hackthe6ix.com"
            >hello@hackthe6ix.com</a
          >
        </Typography>
      </div>
    </div>
  </Layout>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import useUserInfo from '@/utils/useUserInfo';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import Layout from '@/components/Layout';

export default {
  components: {
    Typography,
    Button,
    Layout,
  },
  methods: {
    accept() {
      // TODO: Accept
    },
    decline() {
      // TODO: Decline
    },
  },
  async setup() {
    const router = useRouter();
    const loading = ref(true);

    const check = (val) => {
      if (val?.status) {
        if (!val.status.applied) {
          router.replace('/application');
          return;
        }

        if (val.status.confirmed) {
          router.replace('/dashboard');
          return;
        }
        loading.value = false;
      }
    };

    const { userInfo } = useUserInfo();
    watch(userInfo, check);
    check();

    return {
      userInfo,
      loading,
    };
  },
  computed: {
    canConfirm() {
      return this.userInfo?.status?.canConfirm;
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/colors';
@use '@/styles/mixins';
@use '@/styles/units';

.acceptance {
  border-radius: units.spacing(3);
  background-color: colors.css-color(white);
  padding: units.spacing(16);

  &__content {
    max-width: 800px;
    margin: 0 auto;
  }

  &__heading {
    margin: units.spacing(1) 0 units.spacing(3);
  }

  &__buttons {
    display: flex;
    gap: units.spacing(3);
    margin-top: units.spacing(3);

    @include mixins.media(phone) {
      margin-top: units.spacing(8);
      flex-direction: column;
      gap: units.spacing(3);
    }
  }

  &__link {
    color: colors.css-color(teal);

    &:hover,
    &:focus {
      color: colors.css-color(teal, $modifier: hover);
    }

    &:active {
      color: colors.css-color(teal, $modifier: active);
    }
  }
}
</style>

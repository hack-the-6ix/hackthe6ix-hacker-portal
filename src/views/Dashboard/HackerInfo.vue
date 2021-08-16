<template>
  <div class="hacker-info">
    <loading :active="loading" :can-cancel="false" :is-full-page="true" />
    <div class="hacker-info__content">
      <div class="hacker-info__section">
        <Typography
          class="hacker-info__title"
          transform="uppercase"
          color="dark-navy"
          type="heading3"
          as="h1"
        >
          Application status
        </Typography>
        <Typography
          class="hacker-info__text"
          color="black"
          type="paragraph"
          as="p"
        >
          Welcome to Hack the 6ix 2021! Thanks for confirming your status as a
          hacker!
        </Typography>
        <template v-if="userInfo?.status?.isRSVPOpen">
          <Typography
            class="hacker-info__text"
            color="black"
            type="paragraph"
            as="p"
          >
            If you can no longer attend Hack the 6ix, please let us know so we
            can pass this opportunity to a waitlisted participant.
          </Typography>
          <Button @click="unaccept" type="secondary">
            I can no longer attend HT6
          </Button>
        </template>
      </div>
      <div class="hacker-info__section">
        <Typography
          class="hacker-info__title"
          color="dark-navy"
          transform="uppercase"
          type="heading3"
          as="h2"
        >
          Join our discord
        </Typography>
        <Typography
          class="hacker-info__discord"
          color="black"
          type="paragraph"
          as="p"
        >
          Join our Discord server to get the latest updates and meet fellow
          hackers!<br />
          Issue the following command in the <b>#verification</b> channel to
          gain access:
        </Typography>
        <Typography
          class="hacker-info__verify"
          color="black"
          align="center"
          type="pararaph"
          weight="700"
          as="p"
        >
          !verify {{ userInfo?.email }}
        </Typography>
      </div>
      <div class="hacker-info__section">
        <Typography
          class="hacker-info__title"
          color="dark-navy"
          transform="uppercase"
          type="heading3"
          as="h2"
        >
          Useful Links
        </Typography>
        <ul class="hacker-info__links">
          <li v-for="(link, index) in links" :key="index">
            <a
              :class="[
                link.disabled && 'hacker-info__link--disabled',
                'hacker-info__link',
              ]"
              @click="e => link.disabled && e.preventDefault()"
              :href="link.disabled ? '#' : link.link"
              rel="noreferrer noopener"
              target="_blank"
            >
              <img
                class="hacker-info__asset"
                width="30"
                height="30"
                :alt="`Logo of ${link.label}`"
                :src="link.asset"
              />
              <div class="hacker-info__info">
                <Typography type="heading4" color="black" as="h3">
                  {{ link.label }}
                </Typography>
                <Typography color="black" type="paragraph">
                  {{ link.content }}
                </Typography>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';
import useUserInfo from '@/utils/useUserInfo';
import Button from '@/components/Button';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { rsvp } from '../../utils/api';
import swal from 'sweetalert';

export default {
  components: {
    Typography,
    Button,
    Loading,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    startLoading() {
      return setTimeout(() => {
        this.loading = true;
      }, 100);
    },
    stopLoading(timeout) {
      clearTimeout(timeout);
      this.loading = false;
    },
    async unaccept() {
      const confirm = await swal({
        title: 'Confirm Action',
        text: 'Are you sure you want to decline your invitation?\n\nYou will not be able to reverse this decision.',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      });

      if (confirm) {
        const timeout = this.startLoading();

        const result = await rsvp(false);

        if (result.success) {
          document.location.reload();
        } else {
          swal('Error', result.data, 'error');
          this.stopLoading(timeout);
        }
      }
    },
  },
  setup() {
    return {
      ...useUserInfo(),
    };
  },
  computed: {
    links() {
      return [
        {
          link: 'https://discord.hackthe6ix.com',
          asset: require('@/assets/hacker-info/discord.png'),
          label: 'Discord',
          content: 'Connect with hackers, mentors and sponsors!',
        },
        {
          link: 'https://hopin.hackthe6ix.com',
          asset: require('@/assets/hacker-info/hopin.png'),
          label: 'Hopin (Soon)',
          content: 'All our live events and workshops are here!',
          disabled: true,
        },
        {
          link: 'https://hackthe6ix2021.devpost.com/',
          asset: require('@/assets/hacker-info/devpost.png'),
          label: 'Devpost (Soon)',
          content: 'Submit your projects here!',
          disabled: true,
        },
      ];
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.hacker-info {
  padding: units.spacing(16);
  $self: &;

  @include mixins.media(phone) {
    padding: units.spacing(16) units.spacing(12);
  }

  &__content {
    max-width: units.spacing(225);
    margin: 0 auto;
  }

  &__section {
    margin-bottom: units.spacing(12);

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__text {
    margin-bottom: units.spacing(5);
  }

  &__title {
    margin-bottom: units.spacing(3);
  }

  &__discord {
    line-height: 2;
  }

  &__verify {
    background-color: colors.css-color(grey);
    border-radius: units.spacing(5);
    margin-top: units.spacing(2);
    padding: units.spacing(3);
  }

  &__links {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: units.spacing(5);
    list-style-type: none;
    display: grid;
    padding: 0;
    margin: 0;

    @include mixins.media(tablet) {
      grid-template-columns: 1fr;
    }
  }

  &__link {
    grid-template-columns: units.spacing(20) auto;
    grid-gap: units.spacing(2.5);
    text-decoration: none;
    display: grid;

    &--disabled {
      filter: grayscale(100%);
      cursor: not-allowed;
      opacity: 0.2;
    }
  }

  &__asset {
    @include mixins.transition(transform);
    transform: scale(1);
    width: 100%;
    height: auto;

    #{$self}__link:hover:not(#{$self}__link--disabled) &,
    #{$self}__link:focus:not(#{$self}__link--disabled) & {
      transform: scale(0.9);
    }
  }

  &__info {
    flex-direction: column;
    display: flex;

    @include mixins.media(tablet) {
      justify-content: center;
    }
  }
}
</style>

<template>
  <Layout :loading="loading">
    <div class="acceptance">
      <div class="acceptance__content">
        <Typography type="heading4" color="dark-grey" as="p">
          Hack the 6ix 2021
        </Typography>
        <template v-if="invitationOpen">
          <Typography
              class="acceptance__heading"
              type="heading2"
              color="dark-navy"
              as="h1"
          >
            Hacker Invitation
          </Typography>
          <div class="acceptance__prompt">
            <Typography type="heading4" color="black" as="p">
              Congratulations and welcome to Hack the 6ix 2021! We are excited
              to offer you the opportunity to hack with us!
            </Typography>
            <Typography type="heading4" color="black" as="p">
              To confirm your attendance, please RSVP below by
              {{ confirmationDateTime }}!
            </Typography>
          </div>
          <div class="acceptance__buttons">
            <Button @click="accept"> Accept Invitation </Button>
            <Button @click="decline" type="secondary"> Decline </Button>
          </div>
        </template>
        <div class="acceptance__prompt" v-else>
          <Typography
              class="acceptance__heading"
              type="heading2"
              color="dark-navy"
              as="h1"
          >
            Application Status
          </Typography>
          <Typography
            v-for="(line, index) in prompt"
            :key="index"
            type="heading4"
            color="black"
            as="p"
          >
            {{ line }}
          </Typography>
          <Typography type="heading4" color="black" as="p">
            If this is a mistake, or you require assistance. Please contact us
            at
            <a class="acceptance__link" href="mailto:hello@hackthe6ix.com"
              >hello@hackthe6ix.com</a
            >
          </Typography>
        </div>
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
import swal from 'sweetalert';
import { rsvp } from "../utils/api";

export default {
  components: {
    Typography,
    Button,
    Layout,
  },
  methods: {
    async accept() {
      const result = await rsvp(true);

      if (result.success) {
        document.location.reload();
      } else {
        swal('Error', result.data, 'error');
      }
    },
    async decline() {
      const confirm = await swal({
        title: 'Confirm Action',
        text: 'Are you sure you want to decline your invitation?\n\nYou will not be able to reverse this decision.',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      });

      if (confirm) {
        const result = await rsvp(false);

        if (result.success) {
          document.location.reload();
        } else {
          swal('Error', result.data, 'error');
        }
      }
    },
  },
  async setup() {
    const router = useRouter();
    const loading = ref(true);

    const check = (val) => {
      if (val?.status) {
        if (val.status.confirmed) {
          router.replace('/dashboard');
          return;
        }
        loading.value = false;
      }
    };

    const { userInfo } = useUserInfo();
    check(userInfo.value);
    watch(userInfo, check);

    return {
      userInfo,
      loading,
    };
  },
  computed: {
    statusEnum() {
      return {
        DECLINED: 'DECLINED',
        CHECKED_IN: 'CHECKED_IN',
        CONFIRMED: 'CONFIRMED',
        ACCEPTED: 'ACCEPTED',
        WAITLISTED: 'WAITLISTED',
        REJECTED: 'REJECTED',
        APPLIED: 'APPLIED',
        NOT_APPLIED: 'NOT_APPLIED',
      };
    },
    userStatus() {
      if (this.userInfo?.status.declined) {
        return this.statusEnum.DECLINED;
      } else if (this.userInfo?.status.checkedIn) {
        return this.statusEnum.CHECKED_IN;
      } else if (this.userInfo?.status.confirmed) {
        return this.statusEnum.CONFIRMED;
      } else if (this.userInfo?.status.accepted) {
        return this.statusEnum.ACCEPTED;
      } else if (this.userInfo?.status.waitlisted) {
        return this.statusEnum.WAITLISTED;
      } else if (this.userInfo?.status.rejected) {
        return this.statusEnum.REJECTED;
      } else if (this.userInfo?.status.applied) {
        return this.statusEnum.APPLIED;
      }

      return this.statusEnum.NOT_APPLIED;
    },
    confirmationDateTime() {
      const dt = new Date(this.userInfo?.computedConfirmationDeadline);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
      }).format(dt);
    },
    prompt() {
      switch (this.userStatus) {
        case this.statusEnum.DECLINED:
          return [
            `We're sorry to hear that you aren't able to attend Hack the 6ix this
            year. Thank you for applying and we hope to see you again next
            year!`,
          ];
        case this.statusEnum.WAITLISTED:
          return [
            `Thank you for your application for Hack the 6ix. We were very
            impressed with your application, resume, and accomplishments. However,
            due to the immense number of applications that we received this year,
            we are only able to offer you a conditional waitlist acceptance at
            this time.`,
            `We would love to see you at our event and you will be
            notified via e-mail as soon as more space opens up!`,
          ];
        case this.statusEnum.REJECTED:
          return [
            `Unfortunately, due to the overwhelming number of applications that we have received,
            we are not able to offer you admission to this year’s hackathon. We know putting
            together an application takes time and effort, and we sincerely appreciate your interest.`,
            `Thank you once again for your time and interest in Hack the 6ix; we wish
            you all the best and hope to see you next year!`,
          ];
        case this.statusEnum.NOT_APPLIED:
          return [
            `Thank you for your interest in applying for Hack the 6ix 2021. Unfortunately,
            we are not taking any more hacker applications for the year.`,
            `Stay up to date with our socials and we'll look forward to seeing you at Hack the 6ix 2022!`,
          ];
        case this.statusEnum.APPLIED:
          if (this.canConfirm) {
            return [
              `Thank you for applying to Hack the 6ix! Your application is currently being reviewed by our HT6 team.`,
              `Keep an eye on your inbox within the next few weeks for your application results.`,
            ];
          } else {
            return [
              `Thank you for your interest in applying for Hack the 6ix 2021. Unfortunately,
              the confirmation period has passed.`,
            ];
          }
        default:
          return ['Sorry an error occurred.'];
      }
    },
    canConfirm() {
      return this.userInfo?.status?.canConfirm;
    },
    invitationOpen() {
      return this.canConfirm && this.userInfo?.status?.accepted;
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
    margin-top: units.spacing(6);

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

  &__prompt {
    grid-template-columns: 1fr;
    grid-gap: units.spacing(4);
    display: grid;
  }
}
</style>

<template>
  <div class="mail-info">
    <div class="mail-info__content">
      <Typography
        class="mail-info__heading"
        color="dark-navy"
        type="heading3"
        as="h1"
      >
        Mailing Address
      </Typography>

      <template v-if="userInfo?.hackerApplication?.wantSwag">
        <Typography
          class="mail-info__description"
          color="black"
          type="paragraph"
          as="p"
        >
          You have indicated that you are interested in receiving swag. You may
          review the mailing address that you provided during the application
          process below.
        </Typography>
        <Typography
          class="mail-info__name"
          color="black"
          weight="700"
          type="pararaph"
          as="p"
        >
          {{ userInfo.firstName }} {{ userInfo.lastName }}
        </Typography>
        <Typography
          class="mail-info__addressLine1"
          color="black"
          weight="700"
          type="pararaph"
          as="p"
        >
          {{ userInfo?.hackerApplication?.addressLine1 }}
        </Typography>
        <template v-if="userInfo?.hackerApplication?.addressLine2">
          <Typography
            class="mail-info__addressLine2"
            color="black"
            weight="700"
            type="pararaph"
            as="p"
          >
            {{ userInfo?.hackerApplication?.addressLine2 }}
          </Typography>
        </template>
        <Typography
          class="mail-info__area"
          color="black"
          weight="700"
          type="pararaph"
          as="p"
        >
          {{ userInfo?.hackerApplication?.city }},
          {{ userInfo?.hackerApplication?.province }}
          {{ userInfo?.hackerApplication?.postalCode }}
        </Typography>
        <Typography
          class="mail-info__country"
          color="black"
          transform="uppercase"
          weight="700"
          type="pararaph"
          as="p"
        >
          {{ userInfo?.hackerApplication?.country }}
        </Typography>
        <Typography
          class="mail-info__email"
          color="black"
          type="paragraph"
          as="p"
        >
          If you would like to make an amendment, please send us an
          email at
          <a class="mail-info__link" href="mailto:hello@hackthe6ix.com"
            >hello@hackthe6ix.com</a
          > by <b>August 31, 2021 11:59 PM EDT</b>. We will <b>NOT</b> be processing additional requests after this time!
        </Typography>
      </template>
      <template v-else>
        <Typography
          class="mail-info__description"
          color="black"
          type="paragraph"
          as="p"
        >
          You have indicated that you are either not located in Canada, or do
          not want swag.
          <br/><br/>
          <b>Only participants with a mailing address in Canada 🇨🇦 are eligible for swag!</b>
          <br/><br/>
          If you believe this is a mistake, please send us an
          email at
          <a class="mail-info__link" href="mailto:hello@hackthe6ix.com"
            >hello@hackthe6ix.com</a
          > by <b>August 31, 2021 11:59 PM EDT</b>. We will <b>NOT</b> be processing additional requests after this time!
        </Typography>
      </template>
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';
import useUserInfo from '@/utils/useUserInfo';

export default {
  components: {
    Typography,
  },
  setup() {
    return {
      ...useUserInfo(),
    };
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.mail-info {
  padding: units.spacing(16);
  $self: &;

  @include mixins.media(phone) {
    padding: units.spacing(16) units.spacing(12);
  }

  &__content {
    max-width: 900px;
    margin: 0 auto;
  }

  &__heading {
    margin-bottom: units.spacing(3);
  }

  &__email {
    margin-top: units.spacing(10);
  }

  &__description {
    margin-bottom: units.spacing(10);
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

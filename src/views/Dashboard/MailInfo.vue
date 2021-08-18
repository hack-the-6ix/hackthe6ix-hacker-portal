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
        <Typography
          class="mail-info__description"
          color="black"
          type="paragraph"
          as="p"
        >
          You have indicated that you are interested in receiving swag, you may review the mailing address that you
          provided during the application process below.
        </Typography>
        <template v-if="userInfo.wantSwag">
          <Typography
            class="mail-info__address"
            color="black"
            align="center"
            weight="700"
            type="pararaph"
            as="p"
          > 
            {{ userInfo.addressLine1 }} {{ userInfo.addressLine2 }} {{userInfo.city }}, {{ userInfo.province }} {{ userInfo.postalCode }}
          </Typography> 
        </template>
      </div>
    </div>
</template>

<script>
import Typography from '@/components/Typography';

export default ({
    components: {
        Typography,
    },
})
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

  &__description {
    margin-bottom: units.spacing(10);
  }
}
</style>
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
          You have indicated that you are interested in receiving swag. You may review the mailing address that you
          provided during the application process below.
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
          {{ userInfo.addressLine1 }}
        </Typography>
        <template v-if="userInfo.addressLine2">
          <Typography
            class="mail-info__addressLine2"
            color="black"
            weight="700"
            type="pararaph"
            as="p"
          > 
            {{ userInfo.addressLine2 }}
          </Typography>
        </template>
        <Typography
          class="mail-info__area"
          color="black"
          weight="700"
          type="pararaph"
          as="p"
        > 
          {{ userInfo.city }}, {{ userInfo.province }} {{ userInfo.postalCode }}
        </Typography> 
        <Typography
          class="mail-info__country"
          color="black"
          transform="uppercase"
          weight="700"
          type="pararaph"
          as="p"
        > 
          {{ userInfo.country }}
        </Typography>    
      </div>
    </div>
</template>

<script>
import Typography from '@/components/Typography';
import useUserInfo from '@/utils/useUserInfo';

export default ({
    components: {
        Typography,
    },
    setup() {
      return {
        ...useUserInfo(),
      };
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
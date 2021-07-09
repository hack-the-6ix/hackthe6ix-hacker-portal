<template>
  <Layout title="" description="">
    <div class="application-submitted__box">
      <FormSection class="application-submitted" label="Team Formation">
        <Typography type="heading4" align="left" color="dark-grey">
          Hack the 6ix Application
        </Typography>
        <br />
        <Typography type="heading2" align="left" color="dark-navy">
          Application Submitted!
        </Typography>
        <br />
        <Typography
          type="p"
          as="p"
          align="left"
          color="black"
          class="application-submitted__content"
        >
          Thank you for completing the application form! You will receive an
          email confirmation soon.<br /><br />
          We will send your application results to your email within a few
          weeks.
        </Typography>

        <hr class="application-submitted__hr" />

        <div class="application-submitted__buttons-spread">
          <Button @click="close" class="application-submitted__buttons-right">
            Back to Home
          </Button>
        </div>
      </FormSection>
    </div>
  </Layout>
</template>

<script>
import Typography from '@/components/Typography';
import FormSection from '@/components/FormSection';
import Button from '@/components/Button';
import Layout from '@/components/Layout';

export default {
  name: 'ApplicationSubmitted',
  components: {
    Typography,
    FormSection,
    Button,
    Layout,
  },
  emits: [' closeApplicationSubmittedDialog '],
  methods: {
    close() {
      this.$emit('closeApplicationSubmittedDialog');
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/units';
@use '@/styles/colors';

.application-submitted {
  &__box {
    background-color: colors.css-color(white);
    border-radius: units.spacing(3);
  }

  &__content {
    margin-top: 2em;
  }

  &__hr {
    margin-top: units.spacing(6);
    margin-bottom: units.spacing(6);
  }

  &__buttons-right {
    margin-left: auto;

    @include mixins.media(tablet) {
      margin-left: 0;
    }
  }

  &__buttons-spread {
    display: flex;
    justify-content: space-between;

    @include mixins.media(tablet) {
      display: grid;
      grid-gap: units.spacing(3);
      grid-template-columns: 1fr;
    }
  }
}
</style>

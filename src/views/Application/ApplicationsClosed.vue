<template>
  <Layout title="" description="">
    <div class="applications-closed__box">
      <FormSection class="team-formation" label="Team Formation">
        <Typography type="heading4" align="left" color="dark-grey">
          Hack the 6ix Application
        </Typography>
        <br />
        <Typography type="heading2" align="left" color="dark-navy">
          Applications are now closed!
        </Typography>
        <br />
        <Typography
          type="p"
          as="p"
          align="left"
          color="black"
          class="applications-closed__content"
        >
          {{
            applied
              ? 'Thank you for applying to Hack the 6ix! Your application is currently being reviewed by our HT6 team. Keep an eye on your inbox within the next few weeks for your application results.'
              : "Thank you for your interest in applying for Hack the 6ix. Unfortunately, we are not taking any more hacker applications for the year. Stay up to date with our socials and we look forward to seeing you next year!"
          }}
        </Typography>
      </FormSection>
    </div>
  </Layout>
</template>

<script>
import Typography from '@/components/Typography';
import FormSection from '@/components/FormSection';
import Layout from '@/components/Layout';

export default {
  name: 'ApplicationsClosed',
  components: {
    Typography,
    FormSection,
    Layout,
  },
  props: {
    applied: Boolean,
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/units';
@use '@/styles/colors';

.applications-closed {
  &__box {
    background-color: colors.css-color(white);
    border-radius: units.spacing(3);
  }

  &__content {
    margin-top: 2em;
  }
}
</style>

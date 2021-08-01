<template> 
  <FormSection class="hacker-info">
    <div class="hacker-info__status">
      <Typography
        class="hacker-info__title"
        color="dark-navy"
        transform="uppercase"
        type="heading3"
        as="h3"
      >
      Application status 
      </Typography>
      <Typography
        class="hacker-info__text"
        color="black"
        type="paragraph"
        as="p"
      >
      Welcome to Hack the 6ix 2021! Thanks for confirming your status as a hacker!
      </Typography>
        <Typography
        class="hacker-info__leave--text"
        color="black"
        type="paragraph"
        as="p"
      >
        If you can no longer attend Hack The 6ix, please let us know so we can pass this opportunity to a waitlisted participant. 
      </Typography>
      <Button class="hacker-info__leave--button">
        I can no longer attend HT6
      </Button>
    </div>
    <div class="hacker-info__discord">
      <Typography
        class="hacker-info__title"
        color="dark-navy"
        transform="uppercase"
        type="heading3"
        as="h3"
      >
      Join our discord
      </Typography>
      <Typography
        class="hacker-info__text"
        color="black"
        type="paragraph"
        as="p"
      >
      Join our Discord server to get the latest updates and meet fellow hackers!
      Issue the following command in the #verification channel to gain access:
      </Typography>
      <div class="hacker-info__verify-block">
      <Typography 
        class="hacker-info__verify"
        color="black"
        align="center"
        weight="700"
        type="pararaph"
        as="p"
      >
      !verify emailgoeshere
      </Typography>
      </div>
    </div>
    <Typography
        class="hacker-info__title"
        color="dark-navy"
        transform="uppercase"
        type="heading3"
        as="h3"
      >
      Useful Links
      </Typography>
    <div class="hacker-info__links">
    <div 
      v-for="link in links" 
      :key="link"
    >
    <a 
      ref="noreferrer noopener"
      class="hacker-info__link"
      :href="link.link"
      target="_blank"
    >
      <div class="hacker-info__community">
        <component
          class="hacker-info__asset"
          v-if="link.asset"
          :is="link.asset"
        />
        <div class="hacker-info__type">
          <Typography 
            class="hacker-info__label"
            v-html="link.label"
            color="black"
            type="heading4"
            as="h4"
          />
          <Typography 
            class="hacker-info__content"
            v-html="link.content"
            color="black"
            type="paragraph"
            as="p"
          />
        </div>
      </div>
      </a>
      </div>
    </div>
  </FormSection>
</template>

<script>
import Typography from "@/components/Typography";
import FormSection from "@/components/FormSection";
import Button from "@/components/Button";
import Hopin from "@/assets/Hopin.svg";
import Discord from "@/assets/Discord.svg";
import Devpost from "@/assets/Devpost.svg";

export default ({
  components: {
    Typography,
    Hopin,
    Discord,
    Devpost,
    FormSection,
    Button
  },
  computed: {
    links() {
      return [
        {
          link: 'https://hopin.hackthe6ix.com',
          asset: 'Hopin',
          label: 'Hopin',
          content: "All our live events and workshops are here!"
        },
        {
          link: 'https://discord.hackthe6ix.com',
          asset: 'Discord',
          label: 'Discord',
          content: "Connect with hackers, mentors and sponsors!"
        },
        {
          link: 'https://hackthe6ix2021.devpost.com/',
          asset: 'Devpost',
          label: 'Devpost',
          content: "Submit your projects here!"
        },
      ]
    }
  },
})
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.hacker-info {
  justify-content: left;

  &__title {
    margin-bottom: units.spacing(3);
  }

  &__status {
    margin-bottom: units.spacing(12);
  }

  &__leave--text, &__leave--button {
    margin-top: units.spacing(4);
  }

  &__discord {
    margin-bottom: units.spacing(12);
  }

  &__links {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: units.spacing(8);

    @include mixins.media(tablet) {
      grid-template-columns: repeat(1, 100%);
    }

    @include mixins.media(phone) {
      grid-template-columns: repeat(1, 100%);
    }
  }

  &__link {
    text-decoration: none;
  }

  &__community {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  &__verify {
    padding: units.spacing(2);
  }

  &__verify-block {
    margin-top: units.spacing(4);
    width: 100%;
    background-color: colors.css-color('light-grey');
    border-radius: units.spacing(4);
  }
}

</style>
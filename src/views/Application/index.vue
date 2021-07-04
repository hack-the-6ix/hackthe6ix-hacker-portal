<template>
  <Layout
    title='Hacker Application'
    :description='`Applications are due ${dueDate}. Your progress
    will automatically be saved every few minutes. Once you’ve
    submitted your application, keep an eye on your inbox
    for your application results!`'
  >
    <nav class='home__nav'>
      <Typography
        v-for='(tab, index) in tabs'
        @click='selected = tab.id'
        :class='[
          selected === tab.id && "home__nav-item--active",
          "home__nav-item",
        ]'
        transform='uppercase'
        :href='`#${tab.id}`'
        type='heading4'
        align='center'
        :key='tab.id'
        as='a'
      >
        {{index + 1}}<span class='home__nav-text'>. {{tab.label}}</span>
      </Typography>
    </nav>
    <form class='home__form'>
      <TeamFormation v-if='selected === "team-formation"' v-model:form='team'/>
      <AboutYou v-if='selected === "about-you"' v-model:form='about_you'/>
      <YourExperience v-if='selected === "your-experience"' v-model:form='your_experience'/>
      <AtHT6 v-if='selected === "at-ht6"' v-model:form='at_ht6'/>
    </form>
  </Layout>
</template>

<script>
import TeamFormation from '@/views/Application/TeamFormation';
import AboutYou from '@/views/Application/AboutYou';
import YourExperience from '@/views/Application/YourExperience';
import AtHT6 from '@/views/Application/AtHT6';
import Typography from '@/components/Typography';
import Layout from '@/components/Layout';
import config from '@/config.js';
import { getProfile } from "../../utils/api";

export default {
  name: 'Application',
  components: {
    TeamFormation,
    AboutYou,
    YourExperience,
    AtHT6,
    Typography,
    Layout,
  },
  data() {
    return {
      selected: 'team-formation',
      your_experience: {},
      about_you: {},
      at_ht6: {},
      team: {},
    };
  },
  watch: {
    form(newVal) {
      console.log(newVal);
    },
  },
  beforeMount() {
    const exists = this.tabs.some(tab => window.location.hash === `#${tab.id}`);
    if (!exists) {
      window.location.hash = `#team-formation`;
    } else {
      this.selected = window.location.hash.slice(1);
    }

    getProfile().then((data) => {
      console.log(data);
    });
  },
  computed: {
    dueDate() {
      return config.application.dueDate.toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          day: 'numeric',
          month: 'long',
        }
      );
    },
    tabs() {
      return [
        {
          label: 'Team formation',
          id: 'team-formation',
        },
        {
          label: 'About you',
          id: 'about-you',
        },
        {
          label: 'Your experience',
          id: 'your-experience',
        },
        {
          label: 'At HT6',
          id: 'at-ht6',
        },
      ];
    },
  },
}
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.home {
  $self: &;

  &__nav {
    margin-bottom: units.spacing(-2);
    display: flex;
  }

  &__nav-item {
    border-top-right-radius: units.spacing(3);
    border-top-left-radius: units.spacing(3);
    padding: units.spacing(6);
    text-decoration: none;
    flex-basis: 1px;
    flex-grow: 1;

    @include mixins.media(tablet) {
      flex-shrink: 1;
    }

    &--active {
      color: colors.css-color(black);
      background-color: white;
      flex-basis: unset;

      & #{$self}__nav-text {
        display: unset;
      }
    }
  }

  &__nav-text {
    @include mixins.media(tablet) {
      display: none;
    }
  }

  &__form {
    background-color: colors.css-color(white);
    border-radius: units.spacing(3);
    overflow: hidden;
  }
}
</style>

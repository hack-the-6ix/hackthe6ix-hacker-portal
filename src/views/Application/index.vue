<template>
  <div>
    <loading :active="loading" :can-cancel="false" :is-full-page="true" />
    <div v-if="loaded">
      <div v-if="user?.status?.canAmendTeam">
        <ApplicationSubmitted
            v-if="applicationSubmittedDialogOpen"
            @closeApplicationSubmittedDialog="
            applicationSubmittedDialogOpen = false
          "
        />
        <Layout :title="title" :description="description" v-else>
          <nav class="home__nav">
            <Typography
                v-for="(tab, index) in tabs"
                @click="selected = tab.id"
                :class="[
                selected === tab.id && 'home__nav-item--active',
                'home__nav-item',
              ]"
                transform="uppercase"
                :href="`#${tab.id}`"
                type="heading4"
                align="center"
                :key="tab.id"
                as="a"
            >
              {{ index + 1
              }}<span class="home__nav-text">. {{ tab.label }}</span>
            </Typography>
          </nav>
          <form
              class="home__form"
              v-on:submit.prevent="submit"
              novalidate
              id="home-form"
          >
            <TeamFormation
                v-show="selected === 'team-formation'"
                v-model:form="team"
                v-model:modelTabSelected="selected"
                :dueDate="dueDate"
                :canAmendTeam="user?.status?.canAmendTeam"
                :pageErrors="pageErrors"
                @updateTeam="updateTeam"
            />
            <AboutYou
                v-show="selected === 'about-you'"
                v-model:form="about_you"
                v-model:errors="errors.about_you"
                v-model:modelTabSelected="selected"
                :pageErrors="pageErrors"
                :enums="enums"
                :canEdit="user?.status?.canApply"
            />
            <YourExperience
                v-show="selected === 'your-experience'"
                v-model:form="your_experience"
                v-model:errors="errors.your_experience"
                v-model:modelTabSelected="selected"
                :pageErrors="pageErrors"
                :enums="enums"
                :canEdit="user?.status?.canApply"
            />
            <AtHT6
                v-show="selected === 'at-ht6'"
                v-model:form="at_ht6"
                v-model:errors="errors.at_ht6"
                v-model:modelTabSelected="selected"
                :pageErrors="pageErrors"
                :enums="enums"
                :canEdit="user?.status?.canApply"
                @updateApplication="runUpdateApplication"
            />
          </form>
          <Typography
              type="p"
              color="white"
              as="p"
              v-if="lastSaved"
              class="home__last-saved"
          >
            Last saved at {{ lastSaved }}
          </Typography>
        </Layout>
      </div>
      <ApplicationsClosed :applied="user.status.applied" v-else />
    </div>
  </div>
</template>

<script>
import TeamFormation from '@/views/Application/TeamFormation';
import AboutYou from '@/views/Application/AboutYou';
import YourExperience from '@/views/Application/YourExperience';
import AtHT6 from '@/views/Application/AtHT6';
import ApplicationsClosed from '@/views/Application/ApplicationsClosed';
import ApplicationSubmitted from '@/views/Application/ApplicationSubmitted';
import Typography from '@/components/Typography';
import Layout from '@/components/Layout';
import useUserInfo from '@/utils/useUserInfo';
import validateForm, { hasErrors } from '@/utils/validateForm';
import {
  getApplicationEnums,
  getProfile,
  getTeam,
  updateApplication,
} from '../../utils/api';
import swal from 'sweetalert';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'Application',
  components: {
    TeamFormation,
    AboutYou,
    YourExperience,
    AtHT6,
    Typography,
    Layout,
    ApplicationsClosed,
    ApplicationSubmitted,
    Loading,
  },
  data() {
    return {
      selected: 'team-formation',
      errors: {
        your_experience: {},
        about_you: {},
        at_ht6: {},
      },
      your_experience: {},
      about_you: {},
      at_ht6: {},
      team: {},
      user: {},
      enums: {},
      lastSaved: '',
      unsavedChanges: false,
      loaded: false,
      loading: false,
      applicationSubmittedDialogOpen: false,
    };
  },
  setup() {
    const { userInfo, loaded } = useUserInfo();

    return {
      userInfo,
      userIsLoaded: loaded,
    };
  },
  watch: {
    userIsLoaded() {
      if (!this.userInfo.status.canAmendTeam) {
        this.$router.replace('/prompt');
      }
    },
    async selected() {
      if (this.user?.status?.canApply && this.unsavedChanges && this.loaded) {
        await this.runUpdateApplication(false);
      }
    },
    your_experience() {
      if (this.loaded) {
        this.unsavedChanges = true;
      }
    },
    about_you() {
      if (this.loaded) {
        this.unsavedChanges = true;
      }
    },
    at_ht6() {
      if (this.loaded) {
        this.unsavedChanges = true;
      }
    },
    'about_you.postalCode'(value) {
      this.about_you.postalCode = value.toUpperCase();
    },
    $route(to) {
      this.selected = to.hash.slice(1);
    },
  },
  methods: {
    handler(event) {
      if (this.unsavedChanges) {
        event.returnValue = `Are you sure you want to leave?`;
      }
    },
    startLoading() {
      return setTimeout(() => {
        this.loading = true;
      }, 100);
    },
    stopLoading(timeout) {
      clearTimeout(timeout);
      this.loading = false;
    },
    async submit() {
      this.errors = validateForm(
        this.about_you,
        this.your_experience,
        this.at_ht6,
      );
      if (hasErrors(this.errors)) {
        // Scroll user to disclaimer
        let y =
          window.pageYOffset +
            document?.getElementById('home-form')?.getBoundingClientRect()
              ?.top || 0;

        window.scrollTo({
          top: y || 0,
          behavior: 'smooth',
        });

        return;
      }

      const confirm = await swal({
        title: 'Confirm Submission',
        text: 'Are you sure you want to submit your application?\n\nYou will not be able to make any additional changes to your application; however, you may update your team up until the submission deadline.',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      });

      if (!confirm) return;

      const timeout = this.startLoading();

      this.runUpdateApplication(true, (success) => {
        this.stopLoading(timeout);

        if (success) {
          this.applicationSubmittedDialogOpen = true;
        }
      });
    },
    async fetchEnums() {
      const result = await getApplicationEnums();

      if (result.success) {
        this.enums = result.data;
      } else {
        swal('Unable to fetch enums', result.data, 'error');
      }

      return true;
    },
    async fetchProfile() {
      const result = await getProfile();

      if (result.success) {
        this.user = result.data;

        // Load immutable data in about you
        this.about_you.firstName = result.data.firstName;
        this.about_you.lastName = result.data.lastName;
        this.about_you.email = result.data.email;

        this.loadApplication(result.data.hackerApplication || {});
        await this.loadTeam(result.data.hackerApplication?.teamCode);
      } else {
        swal('Unable to fetch user', result.data, 'error');
      }

      return true;
    },
    updateTeam(teamCode, memberNames) {
      this.team = {
        code: teamCode,
        memberNames: memberNames,
      };
    },
    async runUpdateApplication(submit, callback) {
      const newApplication = {
        ...this.your_experience,
        ...this.about_you,
        ...this.at_ht6,
      };

      // These are values we injected into the form to display, but don't need to submit
      delete newApplication.firstName;
      delete newApplication.lastName;
      delete newApplication.email;
      delete newApplication.resumeFileName;
      delete newApplication.resume;

      // Delete address fields if they don't want swag
      if (!newApplication.wantSwag) {
        newApplication.addressLine1 = '';
        newApplication.addressLine2 = '';
        newApplication.city = '';
        newApplication.province = '';
        newApplication.postalCode = '';
      }

      const result = await updateApplication(newApplication, submit);

      if (result.success) {
        this.unsavedChanges = false;
        this.lastSaved = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          day: 'numeric',
          month: 'long',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short',
        });

        if (submit) {
          await this.fetchProfile();
        }

        if (callback) {
          callback(true);
        }
      } else {
        if (result.error && result.message) {
          swal(
            'Unable to save application',
            `${
              result.message
            }\n\nThe following fields failed validation:\n${result.error
              .map((e) => e[1])
              .join('\n')}`,
            'error',
          );
        } else {
          swal('Unable to save application', result.data + "\n\nWe are sorry something unexpected happened -- if you believe that you lost work, contact us at hello@hackthe6ix.com and we'll try to help you", 'error');
        }

        if (callback) {
          callback(false);
        }
      }
    },
    loadApplication(hackerApplication) {
      // The hacker application arrives as one big dictionary, so we have to split it up
      // based on the tab
      const fields = {
        about_you: [
          'emailConsent',
          'phoneNumber',
          'gender',
          'pronouns',
          'ethnicity',
          'timezone',
          'country',
          'wantSwag',
          'addressLine1',
          'addressLine2',
          'city',
          'province',
          'postalCode',
        ],
        your_experience: [
          'school',
          'program',
          'yearsOfStudy',
          'hackathonsAttended',
          'resume',
          'resumeSharePermission',
          'githubLink',
          'portfolioLink',
          'linkedinLink',
          'projectEssay',
        ],
        at_ht6: [
          'requestedWorkshops',
          'preEventWorkshops',
          'accomplishEssay',
          'mlhCOC',
          'mlhEmail',
          'mlhData',
        ],
      };

      if (hackerApplication.resumeFileName) {
        // Construct a "fake" file that just passes in the file name
        hackerApplication['resume'] = {
          name: hackerApplication.resumeFileName,
          fakeFile: true,
        };
      }

      for (const section in fields) {
        for (const field of fields[section]) {
          if (hackerApplication[field] !== undefined) {
            this[section][field] = hackerApplication[field];
          }
        }
      }
    },
    async loadTeam(teamCode) {
      if (teamCode) {
        const teamResult = await getTeam();

        if (teamResult) {
          this.team = teamResult.data;
        } else {
          swal('Unable to fetch team', teamResult.data, 'error');
        }
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener('beforeunload', this.handler);
  },
  mounted() {
    window.addEventListener('beforeunload', this.handler);
  },
  beforeMount() {
    const exists = this.tabs.some(
      (tab) => window.location.hash === `#${tab.id}`,
    );
    if (!exists) {
      window.location.hash = `#team-formation`;
    } else {
      this.selected = window.location.hash.slice(1);
    }

    const timeout = this.startLoading();

    Promise.all([this.fetchProfile(), this.fetchEnums()]).then(() => {
      console.log("Okay we're all loaded!");
      this.stopLoading(timeout);
      this.loaded = true;
    });
  },
  computed: {
    /**
     * Possible states:
     * - Did submit, application deadline passed
     * - Did submit, application deadline not passed <- Application submitted state
     * - Did not submit, application deadline passed
     * - Did not submit, application deadline not passed <- Standard state
     */
    title() {
      return this.user?.status?.applied
        ? 'Application has been submitted!'
        : 'Hacker Application';
    },
    description() {
      return this.user?.status?.applied
        ? `The HT6 team will review your application soon. Keep an eye on your inbox for your application results!\n\n
               Updates can be made to your team list until ${this.dueDate}. While you aren't able to make any more edits,
               you can still review your submission details below.`
        : `Applications are due ${this.dueDate}. Once you’ve
              submitted your application, keep an eye on your inbox
              for your application results!`;
    },
    pageErrors() {
      return Object.keys(this.errors)
        .map(
          (key) =>
            Object.values(this.errors[key]).filter(Boolean).length && key,
        )
        .filter(Boolean);
    },
    dueDate() {
      return new Date(
        this.user.computedApplicationDeadline || 0,
      ).toLocaleDateString('en-US', {
        year: 'numeric',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
      });
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
};
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

      @include mixins.media(tablet) {
        flex-basis: unset;
      }

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
  }

  &__last-saved {
    text-align: right;
    margin-top: units.spacing(3);
  }
}

.swal-text {
  text-align: center;
}
</style>

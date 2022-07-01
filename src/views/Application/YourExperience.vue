<template>
  <FormSection
    :disclaimer="disclaimer"
    class="your-experience"
    label="Your Experience"
  >
    <loading :active="loading" :can-cancel="false" :is-full-page="true" />
    <!--
    <Combobox
      label="Your School (Most Recently Attended)"
      placeholder="Select"
      v-bind="bindField('school', errors)"
      v-model="school"
      :maxlength="256"
      :options="schools"
      :disabled="!canEdit"
      required
    />-->
    <Input
      label="Your School (Most Recently Attended)"
      v-bind="bindField('school', errors)"
      placeholder="e.g. University of 6ix"
      :datalist="schools"
      v-model="school"
      :maxlength="256"
      :disabled="!canEdit"
      required
    />
    <Input
      label="Your Program of Study"
      placeholder="e.g. OwO Science"
      v-bind="bindField('program', errors)"
      v-model="program"
      :datalist="programs"
      :disabled="!canEdit || yearsOfStudy === 'High School'"
      required
    />
    <Select
      label="Year of Study"
      placeholder="Select"
      v-bind="bindField('yearsOfStudy', errors)"
      v-model="yearsOfStudy"
      :options="years"
      :disabled="!canEdit"
      required
    />
    <Select
      label="Number of Hackathons Attended"
      placeholder="Select"
      v-bind="bindField('hackathonsAttended', errors)"
      v-model="hackathonsAttended"
      :options="hackathonsOptions"
      :disabled="!canEdit"
      required
    />
    <div class="your-experience__file">
      <FileUpload
        label="Your Resume"
        v-bind="bindField('resume', errors)"
        v-model="resume"
        :accept="['application/pdf']"
        :disabled="!canEdit"
        required
      />
      <Checkbox
        label="I allow Hack the 6ix to distribute my resume to its event sponsors."
        v-bind="bindField('resumeSharePermissions', errors)"
        v-model="resumeSharePermission"
        :disabled="!canEdit"
      />
    </div>
    <!-- shameless plugs btw -->
    <div class="your-experience__gap">
      <Input
        label="GitHub Link"
        placeholder="Ex: https://github.com/hackthe6ix"
        v-bind="bindField('githubLink', errors)"
        v-model="githubLink"
        type="url"
        :maxlength="1024"
        :disabled="!canEdit"
      />
    </div>
    <div class="your-experience__gap">
      <Input
        label="Personal Website or Portfolio"
        placeholder="Ex: https://hackthe6ix.com"
        v-bind="bindField('portfolioLink', errors)"
        v-model="portfolioLink"
        type="url"
        :maxlength="1024"
        :disabled="!canEdit"
      />
    </div>
    <div class="your-experience__gap">
      <Input
        label="LinkedIn"
        placeholder="Ex: https://www.linkedin.com/company/hackthe6ixofficial"
        v-bind="bindField('linkedinLink', errors)"
        v-model="linkedinLink"
        type="url"
        :maxlength="1024"
        :disabled="!canEdit"
      />
    </div>
    <Textarea
      label="Describe a project that you are proud of and explain the impact it had."
      class="your-experience__full"
      v-bind="bindField('projectEssay', errors)"
      v-model="projectEssay"
      :rows="8"
      :maxLength="2056"
      :disabled="!canEdit"
      :lowerCaption="`Minimum 50 Words. Maximum 200 Words. (Current count: ${
        projectEssay?.split(' ').filter(Boolean).length ?? 0
      })`"
      required
    />

    <div class="your-experience__full">
      <hr class="your-experience__hr" />
      <div class="your-experience__buttons-spread">
        <Button
          as="a"
          @click="tabSelected = 'about-you'"
          href="#about-you"
          class="your-experience__button"
        >
          Back
        </Button>
        <Button
          as="a"
          @click="tabSelected = 'at-ht6'"
          href="#at-ht6"
          class="your-experience__button"
        >
          {{ canEdit ? 'Save & Continue' : 'Continue' }}
        </Button>
      </div>
    </div>
  </FormSection>
</template>

<script>
import { computed } from 'vue';
import useFormSection from '@/utils/useFormSection';
import FormSection from '@/components/FormSection';
import FileUpload from '@/components/FileUpload';
import Checkbox from '@/components/Checkbox';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { uploadResume } from '../../utils/api';
import swal from 'sweetalert';
import { computePageLabel } from '../../utils/validateForm';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'YourExperience',
  components: {
    FormSection,
    FileUpload,
    Checkbox,
    Textarea,
    Select,
    Input,
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
  },
  watch: {
    async resume(file) {
      if (file && !file.fakeFile) {
        const timeout = this.startLoading();

        const result = await uploadResume(file);

        this.stopLoading(timeout);

        if (result.success) {
          swal(
            'Success!',
            'Your resume has been successfully uploaded',
            'success',
          );
        } else {
          swal(
            'Uh oh',
            `Your resume could not be uploaded\n\n${result.data}`,
            'error',
          );

          this.resume = null;
        }
      }
    },
    yearsOfStudy(yos) {
      // Force highschool students to pick highschool as their program
      if (yos === 'High School' && this.program !== 'High School') {
        this.program = 'High School';
      }
    },
  },
  computed: {
    disclaimer() {
      const fieldErrors = Object.values(this.errors).filter(Boolean);
      const pageErrors = this.pageErrors
        .filter((id) => id !== 'your_experience')
        .map((id) => {
          const label = computePageLabel(id);
          return `<a class='your-experience__link' href="#${id.replace(
            /_/g,
            '-',
          )}">${label}</a>`;
        });

      if (!fieldErrors.length && !pageErrors.length) return;

      const disclaimerSections = [];

      if (pageErrors?.length > 0) {
        disclaimerSections.push({
          label: 'Please resolve the following pages before you submit.',
          items: pageErrors,
        });
      }

      if (fieldErrors?.length > 0) {
        disclaimerSections.push({
          label: 'Please resolve the following fields before you submit.',
          items: fieldErrors,
        });
      }

      return disclaimerSections;
    },
    programs() {
      return this.enums?.programOfStudy ?? [];
      /*return (this.enums?.programOfStudy || []).map((x) => ({
        label: x,
        value: x,
      }));*/
    },
    years() {
      return (this.enums?.yearsOfStudy || []).map((x) => ({
        label: x,
        value: x,
      }));
    },
    schools() {
      return this.enums?.school ?? [];
    },
    hackathonsOptions() {
      return (this.enums?.hackathonsAttended || []).map((x) => ({
        label: x,
        value: x,
      }));
    },
  },
  props: {
    form: Object,
    enums: Object,
    canEdit: Boolean,
    errors: Object,
    pageErrors: Array,
  },
  emits: ['update:form', 'update:modelTabSelected', 'update:errors'],
  setup(props, { emit }) {
    return {
      ...useFormSection(props, {
        school: '',
        program: '',
        yearsOfStudy: '',
        hackathonsAttended: '',
        resume: null,
        resumeSharePermission: false,
        githubLink: '',
        portfolioLink: '',
        linkedinLink: '',
        projectEssay: ''
      }),
      tabSelected: computed({
        set: (value) => emit('update:modelTabSelected', value),
        get: () => props.modelTabSelected,
      }),
    };
  },
};
</script>

<style lang="scss">
@use '@/styles/colors';
@use '@/styles/mixins';
@use '@/styles/units';

.your-experience {
  grid-template-columns: 1fr 1fr;
  grid-gap: units.spacing(6);
  align-items: start;
  display: grid;

  @include mixins.media(tablet) {
    grid-template-columns: minmax(1px, 1fr);
  }

  &__full {
    grid-column: span 2;

    @include mixins.media(tablet) {
      grid-column: span 1;
    }
  }

  &__gap {
    grid-template-columns: 1fr 1fr;
    grid-gap: units.spacing(6);
    grid-column: span 2;
    display: grid;

    @include mixins.media(tablet) {
      grid-template-columns: 1fr;
      grid-column: span 1;
    }
  }

  &__file {
    grid-template-columns: minmax(1px, 1fr);
    grid-gap: units.spacing(3);
    grid-column: span 2;
    display: grid;

    @include mixins.media(tablet) {
      grid-column: span 1;
    }
  }

  &__hr {
    margin-bottom: units.spacing(6);
  }

  &__button {
    text-decoration: none;
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

  &__link {
    @include mixins.transition(color);
    color: colors.css-color(navy);

    &:hover,
    &:focus {
      color: colors.css-color(navy, hover);
    }

    &:active {
      color: colors.css-color(navy, active);
    }
  }
}
</style>

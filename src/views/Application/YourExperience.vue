<template>
  <FormSection class='your-experience' label='Your Experience'>
    <Select
      label='Your School (Most Recently Attended)'
      placeholder='Select'
      v-model='school'
      name='school'
      :options='schools'
      required
    />
    <Select
      label='Your Program of Study'
      placeholder='Select'
      v-model='program'
      name='program'
      :options='programs'
      required
    />
    <Select
      label='Year of Study'
      placeholder='Select'
      v-model='year_of_study'
      name='year_of_study'
      :options='years'
      required
    />
    <Select
      label='Number of Hackathons Attended'
      placeholder='Select'
      v-model='hackathons'
      name='hackathons'
      :options='hackathonsOptions'
      required
    />
    <div class='your-experience__file'>
      <FileUpload
        label='Your Resume'
        v-model='resume'
        name='resume'
        required
      />
      <Checkbox
        label='I allow Hack the 6ix to distribute my resume to its event sponsors.'
        v-model='share_resume'
        name='share_resume'
      />
    </div>
    <!-- shameless plugs btw -->
    <div class='your-experience__gap'>
      <Input
        label='Github Link'
        placeholder='Ex: https://github.com/fpunny'
        v-model='github'
        name='github'
        type='url'
      />
    </div>
    <div class='your-experience__gap'>
      <Input
        label='Personal Website or Portfolio'
        placeholder='Ex: https://fpunny.xyz'
        v-model='portfolio'
        name='portfolio'
        type='url'
      />
    </div>
    <div class='your-experience__gap'>
      <Input
        label='Linkedin'
        placeholder='Ex: https://www.linkedin.com/company/hackthe6ixofficial'
        v-model='linkedin'
        name='linkedin'
        type='url'
      />
    </div>
    <Textarea
      label='Tell us about a project that you are proud of. What tools did you use and what was the outcome?'
      class='your-experience__full'
      v-model='experience'
      name='experience'
    />
  </FormSection>
</template>

<script>
import useFormSection from '@/utils/useFormSection';
import FormSection from '@/components/FormSection';
import FileUpload from '@/components/FileUpload';
import Checkbox from '@/components/Checkbox';
import Textarea from '@/components/Textarea';
import Select from '@/components/temp/Select';
import Input from '@/components/Input';

export default {
  name: 'YourExperience',
  components: {
    FormSection,
    FileUpload,
    Checkbox,
    Textarea,
    Select,
    Input,
  },
  computed: {
    schools() {
      return [
        {
          label: 'University of Yeet',
          value: 'UNIVERSITY_OF_YEET',
        },
      ];
    },
    programs() {
      return [
        {
          label: 'Somethingology',
          value: 'SOMETHINGOLOGY',
        },
      ];
    },
    years() {
      return [
        {
          label: 'First Year',
          value: 'FIRST_YEAR',
        },
      ];
    },
    hackathonsOptions() {
      return [
        {
          label: 'Too Many',
          value: 'TOO_MANY',
        },
      ];
    },
  },
  props: {
    form: Object,
  },
  emits: ['update:form'],
  setup(props) {
    return {
      ...useFormSection(props, {
        school: '',
        program: '',
        year_of_study: '',
        hackathons: '',
        resume: null,
        share_resume: false,
        github: '',
        portfolio: '',
        linkedin: '',
        experience: '',
      }),
    };
  },
}
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/units';

.your-experience {
  grid-template-columns: 1fr 1fr;
  grid-gap: units.spacing(6);
  display: grid;

  @include mixins.media(tablet) {
    grid-template-columns: 1fr;
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
    grid-template-columns: 1fr;
    grid-gap: units.spacing(3);
    grid-column: span 2;
    display: grid;

    @include mixins.media(tablet) {
      grid-column: span 1;
    }
  }
}
</style>
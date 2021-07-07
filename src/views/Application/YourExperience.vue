<template>
  <FormSection class='your-experience' label='Your Experience'>
    <Select
      label='Your School (Most Recently Attended)'
      placeholder='Select'
      v-model='school'
      name='school'
      :maxlength="256"
      :options='schools'
      :disabled="!canEdit"
      required
    />
    <Select
      label='Your Program of Study'
      placeholder='Select'
      v-model='program'
      name='program'
      :maxlength="256"
      :options='programs'
      :disabled="!canEdit"
      required
    />
    <Select
      label='Year of Study'
      placeholder='Select'
      v-model='yearsOfStudy'
      name='yearsOfStudy'
      :options='years'
      :disabled="!canEdit"
      required
    />
    <Select
      label='Number of Hackathons Attended'
      placeholder='Select'
      v-model='hackathonsAttended'
      name='hackathonsAttended'
      :options='hackathonsOptions'
      :disabled="!canEdit"
      required
    />
    <div class='your-experience__file'>
      <FileUpload
        label='Your Resume'
        v-model='resume'
        name='resume'
        :accept="['pdf']"
        :disabled="!canEdit"
        required
      />
      <Checkbox
        label='I allow Hack the 6ix to distribute my resume to its event sponsors.'
        v-model='resumeSharePermission'
        name='resumeSharePermission'
        :disabled="!canEdit"
      />
    </div>
    <!-- shameless plugs btw -->
    <div class='your-experience__gap'>
      <Input
        label='GitHub Link'
        placeholder='Ex: https://github.com/fpunny'
        v-model='githubLink'
        name='githubLink'
        type='url'
        :maxlength="1024"
        :disabled="!canEdit"
      />
    </div>
    <div class='your-experience__gap'>
      <Input
        label='Personal Website or Portfolio'
        placeholder='Ex: https://fpunny.xyz'
        v-model='portfolioLink'
        name='portfolioLink'
        type='url'
        :maxlength="1024"
        :disabled="!canEdit"
      />
    </div>
    <div class='your-experience__gap'>
      <Input
        label='Linkedin'
        placeholder='Ex: https://www.linkedin.com/company/hackthe6ixofficial'
        v-model='linkedinLink'
        name='linkedinLink'
        type='url'
        :maxlength="1024"
        :disabled="!canEdit"
      />
    </div>
    <Textarea
      label='Tell us about a project that you are proud of. What tools did you use and what was the outcome?'
      class='your-experience__full'
      v-model='projectEssay'
      name='projectEssay'
      :rows="8"
      :maxLength="2056"
      :disabled="!canEdit"
      :lowerCaption="`Minimum 50 Words (Current count: ${ projectEssay.length ? projectEssay.split(' ').length : 0 })`"
    />

    <div class="your-experience__full">
      <hr class="your-experience__hr">
      <div class="your-experience__buttons-spread">
        <Button as='a' @click="tabSelected = 'about-you'" href="#about-you" class="your-experience__button">
          Back
        </Button>
        <Button as='a' @click="tabSelected = 'at-ht6'" href="#at-ht6" class="your-experience__button">
          {{ canEdit ? "Save & Continue" : "Continue" }}
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
import { uploadResume } from "../../utils/api";
import swal from 'sweetalert';

export default {
  name: 'YourExperience',
  components: {
    FormSection,
    FileUpload,
    Checkbox,
    Textarea,
    Select,
    Input,
    Button
  },
  watch: {
    async resume(file) {
      if (file && !file.fakeFile) {
        const result = await uploadResume(file);

        if (result.success) {
          swal('Success!', 'Your resume has been successfully uploaded', 'success');
        } else {
          swal('Uh oh', `Your resume could not be uploaded\n\n${result.data}`, 'error');
        }
      }
    }
  },
  computed: {
    schools() {
      return (this.enums?.school || []).map(x => ({
        label: x,
        value: x,
      }));
    },
    programs() {
      return (this.enums?.programOfStudy || []).map(x => ({
        label: x,
        value: x,
      }));
    },
    years() {
      return (this.enums?.yearsOfStudy || []).map(x => ({
        label: x,
        value: x,
      }));
    },
    hackathonsOptions() {
      return (this.enums?.hackathonsAttended || []).map(x => ({
        label: x,
        value: x,
      }));
    },
  },
  props: {
    form: Object,
    enums: Object,
    canEdit: Boolean
  },
  emits: ['update:form', 'update:modelTabSelected'],
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
        projectEssay: '',
      }),
      tabSelected: computed({
        set: value => emit('update:modelTabSelected', value),
        get: () => props.modelTabSelected,
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
}
</style>

<template>
  <FormSection :disclaimer="disclaimer" class="at-ht6" label="At HT6">
    <MultiCheckbox
      label="Which panels or workshops are you most interested in seeing at Hack the 6ix?"
      class="at-ht6__full"
      v-bind="bindField('requestedWorkshops', errors)"
      v-model="requestedWorkshops"
      :limit="3"
      :disabled="!canEdit"
      :options="requestedWorkshopsOptions"
    />
<!--    <Textarea-->
<!--      label="Which panels or workshops are you most interested in seeing at Hack the 6ix?"-->
<!--      class="at-ht6__full"-->
<!--      v-bind="bindField('requestedWorkshops', errors)"-->
<!--      v-model="requestedWorkshops"-->
<!--      :disabled="!canEdit"-->
<!--      :rows="8"-->
<!--      :maxLength="2056"-->
<!--    />-->

    <Textarea
        label="Why would you like to attend Hack the 6ix?"
        class="at-ht6__full"
        v-bind="bindField('whyHT6Essay', errors)"
        v-model="whyHT6Essay"
        :rows="8"
        :maxLength="2056"
        :maxWords="200"
        :disabled="!canEdit"
        :lowerCaption="`Minimum 50 Words. Maximum 200 Words. (Current count: ${
        whyHT6Essay?.split(' ').filter(Boolean).length ?? 0
      })`"
        required
    />

    <Textarea
        label="Describe a technology/innovation that you are excited to explore in the future."
        class="at-ht6__full"
        v-bind="bindField('techInnovationEssay', errors)"
        v-model="techInnovationEssay"
        :rows="8"
        :maxLength="2056"
        :maxWords="200"
        :disabled="!canEdit"
        :lowerCaption="`Minimum 50 Words. Maximum 200 Words. (Current count: ${
        techInnovationEssay?.split(' ').filter(Boolean).length ?? 0
      })`"
        required
    />
<!--    <Select-->
<!--      label="Would you be interested in attending introductory workshops the week prior to the hackathon?"-->
<!--      placeholder="Select"-->
<!--      v-bind="bindField('preEventWorkshops', errors)"-->
<!--      v-model="preEventWorkshops"-->
<!--      :options="preEventWorkshopsOptions"-->
<!--      :disabled="!canEdit"-->
<!--      required-->
<!--    />-->
    <Checkbox
      label='I have read and agree to the <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
      target="_blank" rel="noreferrer noopener" class="at-ht6__link">MLH Code of Conduct</a>.'
      v-bind="bindField('mlhCOC', errors)"
      v-model="mlhCOC"
      class="at-ht6__full"
      :disabled="!canEdit"
      required
    />
    <Checkbox
      label="I authorize MLH to send me pre- and post-event informational
      emails, which contain free credit and opportunities from their partners."
      class="at-ht6__full"
      v-bind="bindField('mlhEmail', errors)"
      v-model="mlhEmail"
      :disabled="!canEdit"
    />
    <Checkbox
      label='I authorize Hack the 6ix to share my application/registration
      information with Major League Hacking for event administration, ranking,
      and MLH administration in-line with the MLH Privacy Policy. I further
      agree to the terms of both the <a class="at-ht6__link"
      href="https://github.com/MLH/mlh-policies/blob/master/prize-terms-and-conditions/contest-terms.md"
      target="_blank" rel="noreferrer noopener">MLH Contest Terms and Conditions</a> and the <a
      href="https://mlh.io/privacy" target="_blank" rel="noreferrer noopener" class="at-ht6__link">
      MLH Privacy Policy</a>.'
      class="at-ht6__full"
      v-bind="bindField('mlhData', errors)"
      v-model="mlhData"
      :disabled="!canEdit"
      required
    />

    <div class="at-ht6__full">
      <hr class="at-ht6__hr" />
      <div class="at-ht6__buttons-spread">
        <Button
          as="a"
          @click="tabSelected = 'your-experience'"
          href="#your-experience"
          class="at-ht6__button"
        >
          Back
        </Button>
        <div class="at-ht6__buttons-together">
          <Button
            class="at-ht6__button"
            @click="save"
            :disabled="!canEdit"
            v-if="canEdit"
          >
            Save
          </Button>
          <Button class="at-ht6__button" htmlType="submit" :disabled="!canEdit">
            {{ canEdit ? 'Submit' : 'Submitted' }}
          </Button>
        </div>
      </div>
    </div>
  </FormSection>
</template>

<script>
import { computed } from 'vue';
import useFormSection from '@/utils/useFormSection';
import FormSection from '@/components/FormSection';
import Checkbox from '@/components/Checkbox';
import Textarea from '@/components/Textarea';
// import Select from '@/components/Select';
import Button from '@/components/Button';
import swal from 'sweetalert';
import { computePageLabel } from '../../utils/validateForm';
import MultiCheckbox from "@/components/MultiCheckbox";

export default {
  name: 'AtHT6',
  components: {
    MultiCheckbox,
    FormSection,
    Checkbox,
    Textarea,
    Button,
    // Select,
  },
  props: {
    form: Object,
    canEdit: Boolean,
    errors: Object,
    pageErrors: Array,
    enums: Object,
  },
  computed: {
    disclaimer() {
      const fieldErrors = Object.values(this.errors).filter(Boolean);
      const pageErrors = this.pageErrors
        .filter((id) => id !== 'at_ht6')
        .map((id) => {
          const label = computePageLabel(id);
          return `<a class='at-ht6__disclaimer-link' href="#${id.replace(
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
    requestedWorkshopsOptions() {
      return (this.enums?.requestedWorkshops || []).map((x) => ({
        label: x,
        value: x,
      }));
    },
  },
  methods: {
    save() {
      this.$emit('updateApplication', false, () => {
        swal(
          'Application Saved',
          'Your changes have been successfully saved',
          'success',
        );
      });
    },
  },
  emits: ['update:form', 'update:modelTabSelected', 'update:errors'],
  setup(props, { emit }) {
    return {
      ...useFormSection(props, {
        requestedWorkshops: '',
        whyHT6Essay: '',
        techInnovationEssay: '',
        mlhCOC: false,
        mlhEmail: false,
        mlhData: false,
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
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.at-ht6 {
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

  &__head {
    grid-template-columns: 1fr;
    grid-gap: units.spacing(2);
    display: grid;
  }

  &__link {
    color: colors.css-color(teal);
    text-decoration: none;
    pointer-events: all;
    cursor: pointer;

    &:hover,
    &:focus {
      color: colors.css-color(teal, hover);
    }

    &:active {
      color: colors.css-color(teal, active);
    }
  }

  &__hr {
    margin-bottom: units.spacing(6);
  }

  &__button {
    text-decoration: none;
  }

  &__buttons-together {
    display: flex;
    justify-content: center;
    grid-gap: units.spacing(3);

    @include mixins.media(tablet) {
      display: grid;
      grid-template-columns: 1fr;
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

  &__disclaimer-link {
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

<template>
  <FormSection class='at-ht6' label='At HT6'>
    <Textarea
      label='Which panels or workshops are you most interested in at Hackthe6ix?'
      class='at-ht6__full'
      v-model='requestedWorkshops'
      name='requestedWorkshops'
    />
    <Textarea
      label='What do you hope to accomplish by attending Hack the 6ix?'
      class='at-ht6__full'
      v-model='accomplishEssay'
      name='accomplishEssay'
      required
    />
    <Checkbox
      label='I have read and agree to the <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
      target="_blank" rel="noreferrer noopener" class="at-ht6__link">MLH Code of Conduct</a>.'
      v-model='mlhCOC'
      name='mlhCOC'
      class='at-ht6__full'
      required
    />
    <Checkbox
      label='I authorize MLH to send me pre- and post-event informational
      emails, which contain free credit and opportunities from their partners.'
      class='at-ht6__full'
      v-model='mlhEmail'
      name='mlhEmail'
      required
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
      class='at-ht6__full'
      v-model='mlhData'
      name='mlhData'
      required
    />

    <div class="at-ht6__full">
      <hr class="at-ht6__hr">
      <div class="at-ht6__buttons-spread">
        <Button as='a' @click="tabSelected = 'your-experience'" href="#your-experience" class="at-ht6__button">
          Back
        </Button>
        <Button class="at-ht6__button">
          Submit
        </Button>
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
import Button from '@/components/Button';

export default {
  name: 'AtHT6',
  components: {
    FormSection,
    Checkbox,
    Textarea,
    Button
  },
  props: {
    form: Object,
    canEdit: Boolean
  },
  emits: ['update:form', 'update:modelTabSelected'],
  setup(props, { emit }) {
    return {
      ...useFormSection(props, {
        requestedWorkshops: '',
        accomplishEssay: '',
        mlhCOC: false,
        mlhEmail: false,
        mlhData: false,
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
@use '@/styles/colors';
@use '@/styles/units';

.at-ht6 {
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

    &:hover, &:focus {
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

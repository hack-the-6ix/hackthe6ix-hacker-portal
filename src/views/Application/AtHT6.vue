<template>
  <FormSection class='at-ht6' label='At HT6'>
    <Radio
      label='Have you already formed a team for Hack the 6ix?'
      :options='team_options'
      v-model='have_team'
      name='have_team'
      required
    />
    <MultiCheckbox
      label='Which panels or workshops are you most interested in at Hackthe6ix? (Pick top 3)'
      :options='event_options'
      v-model='interests'
      name='interets'
      limit='3'
    />
    <Textarea
      label='What do you hope to accomplish by attending Hack the 6ix?'
      v-model='goals'
      name='goals'
      required
    />
    <Checkbox
      label='I have read and agree to the MLH Code of Conduct.'
      v-model='code_of_conduct'
      name='code_of_conduct'
      required
    />
    <Checkbox
      label='I authorize MLH to send me pre- and post-event informational
      emails, which contain free credit and opportunities from their partners.'
      v-model='mlh_email'
      name='mlh_email'
      required
    />
    <Checkbox
      label='I authorize Hack the 6ix to share my application/registration
      information with Major League Hacking for event administration, ranking,
      and MLH administration in-line with the MLH Privacy Policy. I further
      agree to the terms of both the MLH Contest Terms and Conditions and the
      MLH Privacy Policy.'
      v-model='share_mlh'
      name='share_mlh'
      required
    />
  </FormSection>
</template>

<script>
import useFormSection from '@/utils/useFormSection';
import FormSection from '@/components/FormSection';
import MultiCheckbox from '@/components/temp/MultiCheckbox';
import Checkbox from '@/components/temp/Checkbox';
import Radio from '@/components/temp/Radio';

export default {
  name: 'AtHT6',
  components: {
    FormSection,
    MultiCheckbox,
    Checkbox,
    Radio,
  },
  computed: {
    team_options() {
      return [
        {
          label: 'Yes',
          value: 'YES',
        },
        {
          label: 'No',
          value: 'NO',
        },
      ];
    },
    interests() {
      return [
        {
          label: 'Option owo',
          value: 'OWO',
        },
        {
          label: 'Option uwu',
          value: 'UWU',
        },
        {
          label: 'Option >w<',
          value: '>W<',
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
        have_team: '',
        interests: [],
        code_of_conduct: false,
        mlh_email: false,
        share_mlh: false,
      }),
    };
  },
}
</script>

<style lang="scss">
@use '@/styles/units';

.at-ht6 {
  grid-template-columns: 1fr;
  grid-gap: units.spacing(6);
  display: grid;
}
</style>
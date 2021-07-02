<template>
  <FormSection class='at-ht6' label='At HT6'>
    <Radio
      label='Have you already formed a team for Hack the 6ix?'
      :options='team_options'
      class='at-ht6__full'
      v-model='have_team'
      name='have_team'
      required
    />
    <template v-if='have_team === "YES"'>
      <div class='at-ht6__head at-ht6__full'>
        <Typography type='heading3' color='dark-navy'>
          Team member Information
        </Typography>
        <Typography type='paragraph' color='black'>
          Enter the name and email of your team members below. Each team can have a
          maximum of four members. You can still add more team members once the event starts. 
        </Typography>
      </div>
      <template
        v-for='index in [1, 2, 3, 4]'
        :key='index'
      >
        <Input
          v-model='this[`team_member_${index}`].name'
          :label='`Name of Team Member ${index}`'
          :name='`team_member_name_${index}`'
          required
        />
        <Input
          v-model='this[`team_member_${index}`].email'
          :label='`Email of Team Member ${index}`'
          :name='`team_member_email_${index}`'
          type='email'
          required
        />
      </template>
    </template>
    <MultiCheckbox
      label='Which panels or workshops are you most interested in at Hackthe6ix?<br/>(Pick top 3)'
      :options='event_options'
      class='at-ht6__full'
      v-model='interests'
      name='interests'
      disabled
      :limit='3'
    />
    <Textarea
      label='What do you hope to accomplish by attending Hack the 6ix?'
      class='at-ht6__full'
      v-model='goals'
      name='goals'
      required
    />
    <Checkbox
      label='I have read and agree to the <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
      target="_blank" rel="noreferrer noopener" class="at-ht6__link">MLH Code of Conduct</a>.'
      v-model='code_of_conduct'
      name='code_of_conduct'
      class='at-ht6__full'
      required
    />
    <Checkbox
      label='I authorize MLH to send me pre- and post-event informational
      emails, which contain free credit and opportunities from their partners.'
      class='at-ht6__full'
      v-model='mlh_email'
      name='mlh_email'
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
      v-model='share_mlh'
      name='share_mlh'
      required
    />
  </FormSection>
</template>

<script>
import MultiCheckbox from '@/components/MultiCheckbox';
import useFormSection from '@/utils/useFormSection';
import FormSection from '@/components/FormSection';
import Typography from '@/components/Typography';
import Checkbox from '@/components/Checkbox';
import Radio from '@/components/temp/Radio';
import Input from '@/components/temp/Input';
import Textarea from '@/components/temp/Textarea';

export default {
  name: 'AtHT6',
  components: {
    MultiCheckbox,
    FormSection,
    Typography,
    Checkbox,
    Textarea,
    Radio,
    Input,
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
    event_options() {
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
        {
          label: 'Option TwT',
          value: 'TwT',
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
        goals: '',
        code_of_conduct: false,
        mlh_email: false,
        share_mlh: false,
        team_member_1: {
          name: '',
          email: '',
        },
        team_member_2: {
          name: '',
          email: '',
        },
        team_member_3: {
          name: '',
          email: '',
        },
        team_member_4: {
          name: '',
          email: '',
        },
      }),
    };
  },
}
</script>

<style lang="scss">
@use '@/styles/colors';
@use '@/styles/units';

.at-ht6 {
  grid-template-columns: 1fr 1fr;
  grid-gap: units.spacing(6);
  display: grid;

  &__full {
    grid-column: span 2;
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
}
</style>
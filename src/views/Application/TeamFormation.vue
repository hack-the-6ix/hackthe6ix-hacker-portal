<template>
  <FormSection label='Team Formation'>
    <Typography type='heading2' align='center' color='dark-navy'>
      You are currently not on a team.
    </Typography>
    <Typography type='heading4' as='p' align='center' color='black'>
      Registering as a team helps speed up the review process.
    </Typography>
  </FormSection>
</template>

<script>
import useFormSection from '@/utils/useFormSection';
import FormSection from '@/components/FormSection';
import Typography from '@/components/Typography';

export default {
  name: 'TeamFormation',
  components: {
    FormSection,
    Typography,
  },
  props: {
    form: Object,
  },
  emits: ['update:form'],
  setup(props) {
    return {
      ...useFormSection(props, {
        name: '',
        code: '',
        members: [],
      }),
    };
  },
};
</script>
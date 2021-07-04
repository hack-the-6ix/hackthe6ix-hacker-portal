<template>
  <FormSection class="team-formation" label='Team Formation'>
    <div v-if="code">

      <Typography type='heading3' as='h3' align='center' color='dark-navy'>
        Team Code
      </Typography>
      <Typography type='heading4' as='h4' align='center' color='black'>
        {{code}}
      </Typography>
      <br />
      <Typography type='heading4' as='h4' align='center' color='black'>
        Teammates can join by entering the Team Code above.
      </Typography>
      <br />
      <Typography type='heading3' as='h3' align='center' color='dark-navy'>
        Members
      </Typography>
      <Typography type='heading4' as='h4' align='center' color='black' v-for="member in memberNames" :key="member">
        {{member}}
      </Typography>

      <hr class="team-formation__hr">


    </div>
    <div v-else>
      <Typography type='heading2' align='center' color='dark-navy'>
        You are currently not on a team.
      </Typography>
      <Typography type='heading4' as='p' align='center' color='black'>
        Registering as a team helps speed up the review process.
      </Typography>
    </div>
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
        code: '',
        memberNames: [],
      }),
    };
  },
};
</script>

<style lang="scss">
  @use '@/styles/units';

  .team-formation {
    &__hr {
      margin-top: units.spacing(6);
      margin-bottom: units.spacing(6);
    }
  }
</style>

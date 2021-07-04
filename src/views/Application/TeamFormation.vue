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

      <div class="team-formation__buttons">
        <Button @click="triggerLeaveTeam">
          Leave Team
        </Button>

        <Button>
          Continue
        </Button>
      </div>
    </div>
    <div v-else>

      <div v-if="joinTeamPage">
        <Typography type='heading2' align='left' color='dark-navy'>
          Join Team
        </Typography>
        <Typography type='heading4' as='p' align='left' color='black'>
          Already have a Team Code? Enter it below to join!
        </Typography>
        <br />

        <div class="team-formation__join-box">
          <Input
              label='Team Code'
              placeholder='Enter team code'
              v-model='temporaryCode'
              name='code'
              required
          />
          <Button @click="triggerJoinTeam">
            Join
          </Button>
        </div>

        <hr class="team-formation__hr">

        <Button @click="joinTeamPage = false">
          Back
        </Button>
      </div>
      <div v-else>
        <Typography type='heading2' align='center' color='dark-navy'>
          You are currently not on a team.
        </Typography>
        <Typography type='heading4' as='p' align='center' color='black'>
          Registering as a team helps speed up the review process.
        </Typography>

        <hr class="team-formation__hr">

        <div class="team-formation__buttons">
          <Button @click="triggerCreateTeam">
            Create Team
          </Button>
          <Button @click="joinTeamPage = true">
            Join Team
          </Button>
        </div>

      </div>
    </div>
  </FormSection>
</template>

<script>
import useFormSection from '@/utils/useFormSection';
import FormSection from '@/components/FormSection';
import Typography from '@/components/Typography';
import Button from "@/components/Button";
import Input from '@/components/Input';
import { createTeam, joinTeam, leaveTeam } from "../../utils/api";

export default {
  name: 'TeamFormation',
  components: {
    Button,
    FormSection,
    Typography,
    Input
  },
  props: {
    form: Object,
  },
  emits: ['update:form'],
  data() {
    return {
      joinTeamPage: false,
      temporaryCode: ''
    }
  },
  setup(props) {
    return {
      ...useFormSection(props, {
        code: '',
        memberNames: [],
      }),
    };
  },
  methods: {
    async triggerLeaveTeam() {
      await leaveTeam();

      this.code = '';
      this.memberNames = [];
    },
    async triggerCreateTeam() {
      const newTeam = await createTeam();

      this.code = newTeam.data.code;
      this.memberNames = newTeam.data.memberNames;
    },
    async triggerJoinTeam() {
      const newTeam = await joinTeam(this.temporaryCode);

      if (newTeam.success) {
        this.code = newTeam.data.code;
        this.memberNames = newTeam.data.memberNames;
      } else {
        alert(newTeam.data);
      }
    }
  }
};
</script>

<style lang="scss">
  @use '@/styles/mixins';
  @use '@/styles/units';

  .team-formation {
    &__hr {
      margin-top: units.spacing(6);
      margin-bottom: units.spacing(6);
    }

    &__buttons {
      grid-template-columns: 1fr 1fr;
      grid-gap: units.spacing(6);
      display: grid;

      @include mixins.media(tablet) {
        grid-template-columns: 1fr;
      }
    }

    &__join-box {
      grid-template-columns: 8fr 2fr;
      grid-gap: units.spacing(6);
      display: grid;

      @include mixins.media(tablet) {
        grid-template-columns: 1fr;
      }
    }
  }
</style>


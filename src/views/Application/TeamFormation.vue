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
        Members ({{(memberNames || []).length}}/4)
      </Typography>
      <Typography type='heading4' as='h4' align='center' color='black' v-for="member in memberNames" :key="member">
        {{member}}
      </Typography>

      <hr class="team-formation__hr">

      <div class="team-formation__buttons-spread">
        <Button @click="triggerLeaveTeam" :disabled="!canAmendTeam">
          Leave Team
        </Button>

        <Button as='a' @click="tabSelected = 'about-you'" href="#about-you" style="text-decoration: none">
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
          <Button @click="triggerJoinTeam" style="margin-top: auto" :disabled="!canAmendTeam">
            Join
          </Button>
        </div>

        <hr class="team-formation__hr">

        <div class="team-formation__buttons-spread">
          <Button @click="joinTeamPage = false">
            Back
          </Button>
        </div>
      </div>
      <div v-else>
        <Typography type='heading2' align='center' color='dark-navy'>
          You are currently not on a team.
        </Typography>
        <Typography type='heading4' as='p' align='center' color='black'>
          Don't have a team? No worries! You can go solo or decide after submitting your application.
          Just remember to do so before {{dueDate}}.
        </Typography>

        <br/>

        <div class="team-formation__buttons-together">
          <Button @click="triggerCreateTeam" :disabled="!canAmendTeam">
            Create Team
          </Button>
          <Button @click="joinTeamPage = true" :disabled="!canAmendTeam">
            Join Team
          </Button>
        </div>

        <hr class="team-formation__hr">

        <div class="team-formation__buttons-spread">
          <Button as='a' @click="tabSelected = 'about-you'" href="#about-you" class="team-formation__buttons-right" style="text-decoration: none">
            Continue
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
import Typography from '@/components/Typography';
import Button from "@/components/Button";
import Input from '@/components/Input';
import swal from 'sweetalert';
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
    modelTabSelected: String,
    dueDate: String,
    canAmendTeam: Boolean
  },
  emits: ['update:form', 'update:modelTabSelected'],
  data() {
    return {
      joinTeamPage: false,
      temporaryCode: ''
    }
  },
  setup(props, { emit }) {
    return {
      ...useFormSection(props, {
        code: '',
        memberNames: [],
      }),
      tabSelected: computed({
        set: value => emit('update:modelTabSelected', value),
        get: () => props.modelTabSelected,
      }),
    };
  },
  methods: {
    async triggerLeaveTeam() {
      swal({
        title: "Confirm Leave Team",
        text: "Are you sure you want to leave this team?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then(async (confirm) => {
        if (confirm) {
          const result = await leaveTeam();

          if (result.success) {
            this.$emit('updateTeam', '', []);
          } else {
            swal('Unable to leave team', result.data, 'error');
          }
        }
      });
    },
    async triggerCreateTeam() {
      const result = await createTeam();

      if (result.success) {
        this.$emit('updateTeam', result.data.code, result.data.memberNames);
      } else {
        swal('Unable to create team', result.data, 'error');
      }
    },
    async triggerJoinTeam() {
      const result = await joinTeam(this.temporaryCode);

      if (result.success) {
        this.$emit('updateTeam', result.data.code, result.data.memberNames);
      } else {
        swal('Unable to join team', result.data, 'error');
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

    &__buttons-right {
      margin-left: auto;

      @include mixins.media(tablet) {
        margin-left: 0;
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

    &__buttons-together {
      display: flex;
      justify-content: center;
      grid-gap: units.spacing(3);

      @include mixins.media(tablet) {
        display: grid;
        grid-template-columns: 1fr;
      }
    }

    &__join-box {
      grid-template-columns: 8fr 2fr;
      grid-gap: units.spacing(3);
      display: grid;

      @include mixins.media(tablet) {
        grid-template-columns: 1fr;
      }
    }
  }
</style>


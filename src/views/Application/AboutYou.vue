<template>
  <FormSection class='about-you' label='About you'>
    <Input
      label='First Name'
      placeholder='Enter first name'
      autocomplete="given-name"
      v-model='firstName'
      name='first_name'
      :disabled="true"
    />
    <Input
      label='Last Name'
      placeholder='Enter last name'
      autocomplete="family-name"
      v-model='lastName'
      name='last_name'
      :disabled="true"
    />
    <Input
      label='Email'
      placeholder='name@gmail.com'
      autocomplete="email"
      v-model='email'
      name='email'
      type='email'
      :disabled="true"
    />
    <Input
      label='Phone Number'
      placeholder='12345678901'
      autocomplete="tel"
      v-model='phone'
      name='phone'
      type='tel'
      required
    />
    <Checkbox
      label='I give permission to Hack the 6ix for sending me emails containing information from the event sponsors.'
      class='about-you__full'
      v-model='allow_email'
      name='allow_email'
    />
    <Select
      label='Gender'
      placeholder='Select'
      v-model='gender'
      name='gender'
      :options='genders'
      required
    />
    <Select
      label='Your Pronouns'
      placeholder='Select'
      v-model='pronoun'
      name='pronouns'
      :options='pronouns'
    />
    <div>
      <Select
        label='Ethnicity'
        placeholder='Select'
        v-model='ethnicity'
        name='ethnicity'
        :options='ethnicities'
        required
      />
    </div>
    <Select
      label='Your Timezone'
      placeholder='Select'
      v-model='timezone'
      name='timezone'
      :options='timezones'
      required
    />
    <Checkbox
      label='I live in Canada <strong>and</strong> I want to receive Hack the 6ix swag.'
      class='about-you__full'
      v-model='in_canada'
      name='in_canada'
    />
    <template v-if='in_canada'>
      <div class='about-you__full'>
        <Typography type='heading3' color='dark-navy' as='h2'>
          Shipping Address
        </Typography>
        <Typography type='paragraphy' color='black'>
          We will ship your Hack The 6ix swag to this address if you
          live in Canada and submit a project on Devpost at the event.
        </Typography>
      </div>
      <Input
        label='Address Line 1'
        placeholder='Enter street number and street name'
        autocomplete="address-line1"
        v-model='address_line_1'
        name='address_line_1'
        required
      />
      <Input
        label='Address Line 2'
        placeholder='Apartment, suite number, etc.'
        autocomplete="address-line2"
        v-model='address_line_2'
        name='address_line_2'
      />
      <Input
        label='City'
        placeholder='Enter city name'
        autocomplete="address-level2"
        v-model='city'
        name='city'
        required
      />
      <Select
        label='Province'
        placeholder='Select'
        v-model='province'
        name='province'
        :options='provinces'
        required
      />
      <Input
        label='Postal Code'
        autocomplete="postal-code"
        placeholder='Ex: V4Q3H9'
        v-model='postal_code'
        name='postal_code'
        required
      />
      <Input
        label='Country'
        modelValue='Canada'
        name='country'
        disabled
      />
    </template>

    <div class="about-you__full">
      <hr class="about-you__hr">
      <div class="about-you__buttons-spread">
        <Button as='a' @click="tabSelected = 'team-formation'" href="#team-formation" class="about-you__button">
          Back
        </Button>
        <Button as='a' @click="tabSelected = 'your-experience'" href="#your-experience" class="about-you__button">
          Save & Continue
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
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import Select from '@/components/Select';
import Input from '@/components/Input';

export default {
  name: 'AboutYou',
  components: {
    FormSection,
    Typography,
    Checkbox,
    Select,
    Input,
    Button
  },
  computed: {
    genders() {
      return (this.enums?.gender || []).map(x => ({
        label: x,
        value: x,
      }));
    },
    pronouns() {
      return (this.enums?.pronouns || []).map(x => ({
        label: x,
        value: x,
      }));
    },
    ethnicities() {
      return (this.enums?.ethnicity || []).map(x => ({
        label: x,
        value: x,
      }));
    },
    timezones() {
      return (this.enums?.timezone || []).map(x => ({
        label: x,
        value: x,
      }));
    },
    provinces() {
      return (this.enums?.province || []).map(x => ({
        label: x,
        value: x,
      }));
    },
  },
  props: {
    modelTabSelected: String,
    form: Object,
    enums: Object,
    canEdit: Boolean
  },
  emits: ['update:form', 'update:modelTabSelected'],
  setup(props, {emit}) {
    return {
      ...useFormSection(props, {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        allow_email: false,
        gender: '',
        pronoun: '',
        ethnicity: '',
        timezone: '',
        in_canada: false,
        address_line_1: '',
        address_line_2: '',
        city: '',
        province: '',
        postal_code: '',
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

.about-you {
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

<template>
  <FormSection class='about-you' label='About you'>
    <Input
      label='First Name'
      placeholder='Enter first name'
      autocomplete="given-name"
      v-model='first_name'
      name='first_name'
      required
    />
    <Input
      label='Last Name'
      placeholder='Enter last name'
      autocomplete="family-name"
      v-model='last_name'
      name='last_name'
      required
    />
    <Input
      label='Email'
      placeholder='name@gmail.com'
      autocomplete="email"
      v-model='email'
      name='email'
      type='email'
      required
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
  </FormSection>
</template>

<script>
import useFormSection from '@/utils/useFormSection';
import FormSection from '@/components/FormSection';
import Checkbox from '@/components/Checkbox';
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
  },
  computed: {
    genders() {
      return [
        {
          label: 'Banana',
          value: 'BANANA',
        },
      ];
    },
    pronouns() {
      return [
        {
          label: 'House Plant',
          value: 'HOUSE_PLANT',
        },
      ];
    },
    ethnicities() {
      return [
        {
          label: 'Frost Giant',
          value: 'FROST_GIANT',
        },
      ];
    },
    timezones() {
      return [
        {
          label: 'OWO TIMES',
          value: 'OWO_TIMES',
        },
      ];
    },
    provinces() {
      return [
        {
          label: 'Ontario',
          value: 'ONTARIO',
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
        first_name: '',
        last_name: '',
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
}
</style>
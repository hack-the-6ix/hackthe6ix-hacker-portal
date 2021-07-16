<template>
  <FormSection :disclaimer="disclaimer" class="about-you" label="About you">
    <Input
      label="First Name"
      placeholder="Enter first name"
      autocomplete="given-name"
      v-bind="bindField('firstName', errors)"
      v-model="firstName"
      disabled
    />
    <Input
      label="Last Name"
      placeholder="Enter last name"
      autocomplete="family-name"
      v-bind="bindField('lastName', errors)"
      v-model="lastName"
      disabled
    />
    <Input
      label="Email"
      placeholder="name@gmail.com"
      autocomplete="email"
      v-bind="bindField('email', errors)"
      v-model="email"
      type="email"
      disabled
    />
    <Input
      label="Phone Number"
      placeholder="12345678901"
      autocomplete="tel"
      v-bind="bindField('phoneNumber', errors)"
      v-model="phoneNumber"
      type="tel"
      :maxlength="20"
      :disabled="!canEdit"
      required
    />
    <Checkbox
      label="I give permission to Hack the 6ix for sending me emails containing information from the event sponsors."
      class="about-you__full"
      v-bind="bindField('emailConsent', errors)"
      v-model="emailConsent"
      :disabled="!canEdit"
    />
    <Select
      label="Gender"
      placeholder="Select"
      v-bind="bindField('gender', errors)"
      v-model="gender"
      :options="genders"
      :disabled="!canEdit"
      required
    />
    <Select
      label="Your Pronouns"
      placeholder="Select"
      v-bind="bindField('pronouns', errors)"
      v-model="pronouns"
      :options="pronounOptions"
      :disabled="!canEdit"
      required
    />
    <div>
      <Select
        label="Ethnicity"
        placeholder="Select"
        v-bind="bindField('ethnicity', errors)"
        v-model="ethnicity"
        :options="ethnicities"
        :disabled="!canEdit"
        required
      />
    </div>
    <Select
      label="Your Timezone"
      placeholder="Select"
      v-bind="bindField('timezone', errors)"
      v-model="timezone"
      :options="timezones"
      :disabled="!canEdit"
      required
    />
    <Input
      label="Country"
      placeholder="e.g. Canada"
      v-bind="bindField('country', errors)"
      v-model="country"
      :datalist="countries"
      :disabled="!canEdit"
      :maxlength="256"
      required
    />
    <!--
    <Combobox
      label="Country"
      placeholder="e.g. Canada"
      v-bind="bindField('country', errors)"
      v-model="country"
      :options="countries"
      :disabled="!canEdit"
      :disallowCustom="true"
      :hideDropdownUntilType="true"
      required
    />-->
    <Checkbox
      label="I live in Canada <strong>and</strong> I want to receive Hack the 6ix swag."
      class="about-you__full"
      v-bind="bindField('wantSwag', errors)"
      v-model="wantSwag"
      :disabled="!canEdit || country !== 'Canada'"
    />
    <template v-if="wantSwag">
      <div class="about-you__full">
        <Typography type="heading3" color="dark-navy" as="h2">
          Shipping Address
        </Typography>
        <Typography type="paragraphy" color="black">
          We will ship your Hack The 6ix swag to this address if you live in
          Canada and submit a project on Devpost at the event.
        </Typography>
      </div>
      <Input
        label="Address Line 1"
        placeholder="Enter street number and street name"
        autocomplete="address-line1"
        v-bind="bindField('addressLine1', errors)"
        v-model="addressLine1"
        :disabled="!canEdit"
        :maxlength="256"
        required
      />
      <Input
        label="Address Line 2"
        placeholder="Apartment, suite number, etc."
        autocomplete="address-line2"
        v-bind="bindField('addressLine2', errors)"
        v-model="addressLine2"
        name="addressLine2"
        :maxlength="256"
        :disabled="!canEdit"
      />
      <Input
        label="City"
        placeholder="Enter city name"
        autocomplete="address-level2"
        v-bind="bindField('city', errors)"
        v-model="city"
        :disabled="!canEdit"
        :maxlength="256"
        required
      />
      <Select
        label="Province"
        placeholder="Select"
        v-bind="bindField('province', errors)"
        v-model="province"
        :options="provinces"
        :disabled="!canEdit"
        required
      />
      <!-- TODO: Add postal code validation -->
      <Input
        label="Postal Code"
        autocomplete="postal-code"
        placeholder="Ex: V4Q3H9"
        v-bind="bindField('postalCode', errors)"
        v-model="postalCode"
        :disabled="!canEdit"
        :maxlength="6"
        required
      />
    </template>

    <div class="about-you__full">
      <hr class="about-you__hr" />

      <div class="about-you__buttons-spread">
        <Button
          as="a"
          @click="tabSelected = 'team-formation'"
          href="#team-formation"
          class="about-you__button"
        >
          Back
        </Button>
        <Button
          as="a"
          @click="tabSelected = 'your-experience'"
          href="#your-experience"
          class="about-you__button"
        >
          {{ canEdit ? 'Save & Continue' : 'Continue' }}
        </Button>
      </div>
    </div>
  </FormSection>
</template>

<script>
import { computed } from 'vue';
import useFormSection from '@/utils/useFormSection';
import FormSection from '@/components/FormSection';
import Typography from '@/components/Typography';
import Checkbox from '@/components/Checkbox';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Input from '@/components/Input';
import { computePageLabel } from '../../utils/validateForm';

export default {
  name: 'AboutYou',
  components: {
    FormSection,
    Typography,
    Checkbox,
    Select,
    Input,
    Button,
  },
  computed: {
    disclaimer() {
      const fieldErrors = Object.values(this.errors).filter(Boolean);
      const pageErrors = this.pageErrors
        .filter((id) => id !== 'about_you')
        .map((id) => {
          const label = computePageLabel(id);
          return `<a class='about-you__link' href="#${id.replace(
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
    genders() {
      return (this.enums?.gender || []).map((x) => ({
        label: x,
        value: x,
      }));
    },
    pronounOptions() {
      return (this.enums?.pronouns || []).map((x) => ({
        label: x,
        value: x,
      }));
    },
    ethnicities() {
      return (this.enums?.ethnicity || []).map((x) => ({
        label: x,
        value: x,
      }));
    },
    timezones() {
      return (this.enums?.timezone || []).map((x) => ({
        label: x,
        value: x,
      }));
    },
    provinces() {
      return (this.enums?.province || []).map((x) => ({
        label: x,
        value: x,
      }));
    },
    countries() {
      return this.enums?.countries ?? [];
      /*return (this.enums?.countries || []).map((x) => ({
        label: x,
        value: x,
      }));*/
    },
  },
  props: {
    modelTabSelected: String,
    pageErrors: Array,
    form: Object,
    enums: Object,
    canEdit: Boolean,
    errors: Object,
  },
  watch: {
    country(c) {
      if (c !== 'Canada') {
        this.wantSwag = false;
      }
    },
  },
  emits: ['update:form', 'update:modelTabSelected', 'update:errors'],
  setup(props, { emit }) {
    return {
      ...useFormSection(props, {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        emailConsent: false,
        gender: '',
        pronouns: '',
        ethnicity: '',
        timezone: '',
        wantSwag: false,
        addressLine1: '',
        addressLine2: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
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

.about-you {
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

  &__link {
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

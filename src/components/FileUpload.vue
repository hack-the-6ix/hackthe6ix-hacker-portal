<template>
  <div class="file-upload">
    <Typography
      class="file-upload__label"
      type="heading4"
      color="dark-navy"
      as="label"
      :for="id"
    >
      {{ label }}{{ required ? '*' : '' }}
    </Typography>
    <div class="file-upload__body">
      <input
        :accept="serializedAccept"
        class="file-upload__field"
        :required="required"
        @input="upload"
        type="file"
        :id="id"
      />
      <div class="file-upload__content">
        <FileIcon width="50" class="file-upload__icon" />
        <div>
          <Typography
            v-if="!this.modelValue"
            type="heading4"
            as="p"
            color="dark-navy"
          >
            Drop Files here or
            <Typography type="heading4" color="teal" as="span">
              Browse
            </Typography>
          </Typography>
          <Typography v-else type="heading4" as="p" color="teal">
            {{ this.modelValue.name }}
          </Typography>
          <Typography type="small" as="p" color="black">
            Accepted file format: {{ accept.join(', ') || 'All' }}
          </Typography>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';
import FileIcon from '@/assets/file.svg';
import { computed } from 'vue';

export default {
  components: {
    Typography,
    FileIcon,
  },
  methods: {
    async upload(event) {
      const file = event.target.files[0];
      this.$emit('update:modelValue', file);
    },
  },
  computed: {
    serializedAccept() {
      return this.accept.join(',');
    },
  },
  props: {
    modelValue: Object,
    required: Boolean,
    label: String,
    accept: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: () => Math.random().toString().slice(-8),
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return {
      value: computed({
        set: (value) => emit('update:modelValue', value),
        get: () => props.modelValue,
      }),
    };
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.file-upload {
  max-width: units.spacing(116);
  $self: &;

  &__label {
    margin-bottom: units.spacing(1.5);
    display: block;
  }

  &__body {
    border-radius: units.spacing(5);
    position: relative;
    overflow: hidden;

    &:hover,
    &:focus {
      background-color: colors.css-color(grey, hover);
    }

    &:active {
      background-color: colors.css-color(grey, active);
    }
  }

  &__content {
    @include mixins.transition(background-color);
    padding: units.spacing(6.5) units.spacing(10);
    grid-template-columns: units.spacing(6) auto;
    background-color: colors.css-color(grey);
    border-radius: units.spacing(5);
    grid-gap: units.spacing(6);
    box-sizing: border-box;
    display: grid;
  }

  &__field {
    border-radius: units.spacing(5);
    position: absolute;
    cursor: pointer;
    margin: auto;
    height: 100%;
    width: 100%;
    opacity: 0;
    z-index: 1;
    inset: 0;

    &:hover #{$self}__content,
    &:active {
      background-color: colors.css-color(grey, hover);
    }
  }

  &__icon {
    fill: colors.css-color(dark-navy);
    align-self: center;
    width: 100%;
  }
}
</style>

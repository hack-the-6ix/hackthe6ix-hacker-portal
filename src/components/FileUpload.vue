<template>
  <FieldLayout
      :required="required"
      :disabled="disabled"
      :noOutline="true"
      :error="error"
      :label="label"
      :id="id"
  >
    <div class="file-upload">
      <div class="file-upload__body">
        <input
          :accept="serializedAccept"
          class="file-upload__field"
          :required="required"
          :disabled='disabled'
          @input="upload"
          :name='name'
          type="file"
          :id="id"
        />
        <div :class="['file-upload__content', error && 'file-upload__error']">
          <FileIcon width="50" class="file-upload__icon" />
          <div>
            <Typography
              v-if="!this.modelValue?.name"
              type="heading4"
              as="p"
              color="dark-navy"
            >
              Drop Files here or
              <Typography type="heading4" color="teal" as="span">
                Browse
              </Typography>
            </Typography>
            <Typography v-else class="file-upload__name" type="heading4" as="p" color="teal">
              {{ this.modelValue?.name }}
            </Typography>
            <Typography type="small" as="p" color="black">
              Accepted file format: {{ accept.join(', ') || 'All' }}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  </FieldLayout>
</template>

<script>
import Typography from '@/components/Typography';
import FieldLayout from '@/components/FieldLayout';
import FileIcon from '@/assets/file.svg';
import { computed } from 'vue';

export default {
  components: {
    Typography,
    FileIcon,
    FieldLayout,
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
    error: String,
    modelValue: Object,
    required: Boolean,
    disabled: Boolean,
    label: String,
    name: String,
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
  $self: &;

  &__label {
    margin-bottom: units.spacing(1.5);
    display: block;
  }

  &__body {
    border-radius: units.spacing(5);
    position: relative;

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

  &__error {
    border: 3px solid colors.css-color(error);
  }

  &__field {
    border-radius: units.spacing(5);
    color: transparent;
    position: absolute;
    cursor: pointer;
    margin: auto;
    height: 100%;
    width: 100%;
    z-index: 1;
    inset: 0;

    &::-webkit-file-upload-button {
      display: none;
    }

    &:disabled {
      cursor: not-allowed;
    }

    &:not(:disabled):hover ~ #{$self}__content,
    &:not(:disabled):focus ~ #{$self}__content {
      background-color: colors.css-color(grey, hover);
    }

    &:not(:disabled):active ~ #{$self}__content {
      background-color: colors.css-color(grey, active);
    }
  }

  &__icon {
    fill: colors.css-color(dark-navy);
    align-self: center;
    width: 100%;
  }

  &__name {
    word-break: break-all;
  }
}
</style>

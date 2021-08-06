<template>
  <div class="tabs">
    <ul class="tabs__nav">
      <li
        :class="[
          index === modelValue && 'tabs__nav-item--selected',
          'tabs__nav-item',
        ]"
        v-for="(tab, index) in tabs"
        :key="index"
      >
        <Typography
          @click="$emit('update:modelValue', index)"
          class="tabs__nav-btn"
          v-html="tab.label"
          type="paragraph"
          as="button"
        />
      </li>
    </ul>
    <div class="tabs__body">
      <component :is="selected.component" />
    </div>
  </div>
</template>

<script>
import Typography from '@/components/Typography';

export default {
  components: {
    Typography,
  },
  props: {
    modelValue: Number,
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    selected() {
      return this.tabs[this.modelValue];
    },
  },
  emits: ['update:modelValue'],
};
</script>

<style lang="scss">
@use '@/styles/colors';
@use '@/styles/units';

.tabs {
  $self: &;

  &__nav {
    list-style-type: none;
    display: flex;
    padding: 0;
    margin: 0;
  }

  &__nav-item {
    margin-bottom: units.spacing(-5);
    flex-basis: 1px;
    flex-grow: 1;
  }

  &__nav-btn {
    padding: units.spacing(5) units.spacing(14) units.spacing(10);
    border-top-right-radius: units.spacing(5);
    border-top-left-radius: units.spacing(5);
    background: transparent;
    height: 100%;
    border: none;
    width: 100%;

    #{$self}__nav-item--selected & {
      background: colors.css-color(white);
      color: colors.css-color(dark-navy);
      font-weight: bold;
    }
  }

  &__body {
    background-color: colors.css-color(white);
    border-radius: units.spacing(3);
  }
}
</style>

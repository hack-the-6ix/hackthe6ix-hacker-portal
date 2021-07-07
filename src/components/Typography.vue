<template>
  <component
    :class="[
      transform && `text--transform--${transform}`,
      weight && `text--weight--${weight}`,
      color && `text--color--${color}`,
      align && `text--align--${align}`,
      `text--type--${type}`,
      'text',
    ]"
    :type="htmlType"
    :is="as"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'Typography',
  props: {
    as: {
      default: () => 'span',
      type: String,
    },
    htmlType: String,
    type: {
      type: String,
      required: true,
    },
    align: String,
    transform: String,
    weight: [String, Number],
    color: {
      type: String,
      default: () => 'white',
    },
  },
};
</script>

<style lang="scss">
@use '@/styles/colors';
@use '@/styles/units';

.text {
  font-family: units.$font;
  letter-spacing: units.spacing(0.25);
  margin: 0;

  @each $type, $config in units.$font-config {
    &--type--#{$type} {
      @each $tag, $val in $config {
        #{$tag}: $val;
      }
    }
  }

  @each $color, $_ in colors.$colors {
    &--color--#{$color} {
      color: colors.css-color($color);
    }
  }

  @each $type in (start center end) {
    &--align--#{$type} {
      text-align: $type;
    }
  }

  @each $type in (uppercase lowercase capitalize) {
    &--transform--#{$type} {
      text-transform: $type;
    }
  }

  @each $weight in (700 400) {
    &--weight--#{$weight} {
      font-weight: $weight;
    }
  }
}
</style>

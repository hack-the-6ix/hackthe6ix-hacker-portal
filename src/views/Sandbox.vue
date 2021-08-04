<template>
  <iframe
    class="sandbox__notion"
    allowtransparency
    frameborder="0"
    src="https://ht6-notion.netlify.app/12ce5072583f487cac5c6e2bb128b599"
  />
</template>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.sandbox {
  &__notion {
    background: colors.css-color(gray);
    border-radius: units.spacing(3);
    margin-top: units.spacing(5);
    height: units.spacing(200);
    width: 100%;
  }
}
</style>

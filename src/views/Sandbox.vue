<template>
  <iframe
    referrerpolicy="no-referrer"
    class="sandbox__notion"
    allowtransparency
    frameborder="0"
    src="https://hackthe6ix2021.notion.site/hackthe6ix2021/Hack-the-6ix-Hacker-Guide-12ce5072583f487cac5c6e2bb128b599"
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
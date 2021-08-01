<template>
  <FormSection class="resources">
      <Typography
        class="resources__title"
        color="dark-navy"
        transform="uppercase"
        type="heading3"
        as="a"
      >
        Notion
      </Typography>
      <div class="resources__iframe">
      <iframe 
        class="resources__notion"
        src="https://hackthe6ix2021.notion.site/hackthe6ix2021/Hack-the-6ix-Hacker-Guide-12ce5072583f487cac5c6e2bb128b599"
      />
      </div>
  </FormSection>
</template>

<script>
import FormSection from "@/components/FormSection";
import Typography from "@/components/Typography";

export default ({
  components: {
    FormSection,
    Typography
  }
})
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/colors';
@use '@/styles/units';

.resources {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  &__title {
    margin-bottom: units.spacing(8);
  }

  &__iframe {
    overflow: hidden;
    padding-top: 100%;
    position: relative;
  }

  &__notion {
    border: none;
    border-radius: 20px;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}

</style>

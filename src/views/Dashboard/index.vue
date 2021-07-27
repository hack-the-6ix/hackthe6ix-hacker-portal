<template>
  <Layout>
    <Tabs
      v-model='selected'
      :tabs='tabs'
    />
  </Layout>
</template>

<script>
import {ref} from 'vue';
import { useStore } from 'vuex';
import Layout from '@/components/Layout';
import Tabs from '@/components/Tabs';
import HackerInfo from './HackerInfo';
import Schedule from './Schedule';
import Resources from './Resources';

export default {
  components: {
    Layout,
    Tabs,
  },
  async setup() {
    const store = useStore();
    await store.dispatch('getUserInfo');

    return {
      selected: ref(0),
      tabs: [
        {
          component: HackerInfo,
          label: 'Hacker Info',
        },
        {
          component: Schedule,
          label: 'Schedule',
        },
        {
          component: Resources,
          label: 'Resources',
        },
      ],
    };
  },
};
</script>
<template>
  <Layout :loading="!loaded">
    <Tabs v-model="selected" :tabs="tabs" />
  </Layout>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import useUserInfo from '@/utils/useUserInfo';
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
    const userInfo = useUserInfo();
    const router = useRouter();
    const loaded = ref(false);

    const checkStatus = (value) => {
      if (value?.status) {
        if (!value.status.confirmed) {
          router.replace('/acceptance');
        }
        loaded.value = true;
      }
    };

    checkStatus(userInfo.value);
    watch(userInfo, checkStatus);

    return {
      selected: ref(0),
      userInfo,
      loaded,
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

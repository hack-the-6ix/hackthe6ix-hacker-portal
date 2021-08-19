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
import MailInfo from './MailInfo';

export default {
  components: {
    Layout,
    Tabs,
  },
  async setup() {
    const { userInfo } = useUserInfo();
    const router = useRouter();
    const loaded = ref(true);

    const checkStatus = (value) => {
      if (value?.status) {
        if (!value.status.applied && value.status.canApply) {
          router.replace('/application');
          return;
        }

        if (!value.status.confirmed) {
          router.replace('/prompt');
          return;
        }
        loaded.value = true;
      }
    };

    checkStatus(userInfo.value);
    watch(userInfo, checkStatus);

    var tabs = [
      {
        component: HackerInfo,
        label:
          '<i class="dashboard__tab-icon fas fa-info-circle"></i><span class="dashboard__tab-text">Hacker Info</span>',
      },
      {
        component: Schedule,
        label:
          '<i class="dashboard__tab-icon fas fa-calendar-alt"></i><span class="dashboard__tab-text">Schedule</span>',
      },
      {
        component: Resources,
        label:
          '<i class="dashboard__tab-icon fas fa-book"></i><span class="dashboard__tab-text">Resources</span>',
      },
    ];

    const mail = {
      component: MailInfo,
        label:
          '<i class="dashboard__tab-icon fas fa-envelope"></i><span class="dashboard__tab-text">Mailing Address</span>',
    };

    const add = (value) => {
      if (value?.wantSwag) {
        tabs.push(mail);
        return tabs;
      }
    }

    add(userInfo.value);
    watch(userInfo, add);

    return {
      selected: ref(0),
      userInfo,
      loaded,
      tabs
    };
  },
};
</script>

<style lang="scss">
@use '@/styles/mixins';
@use '@/styles/units';

.dashboard {
  &__tab-icon {
    display: none;
    @include mixins.media(tablet) {
      display: inline-block;
    }
  }

  &__tab-text {
    display: inline-block;
    @include mixins.media(tablet) {
      display: none;
    }
  }
}
</style>

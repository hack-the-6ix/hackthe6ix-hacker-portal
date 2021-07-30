import { useStore } from 'vuex';
import { computed } from 'vue';

export default async function useUserInfo() {
  const store = useStore();
  const userInfo = computed(() => store.state.userInfo);

  if (!userInfo.value) {
    await store.dispatch('getUserInfo');
  }

  return userInfo;
}

import { useStore } from 'vuex';
import { computed } from 'vue';

export default function useUserInfo() {
  const store = useStore();
  const userInfo = computed(() => store.state.userInfo);

  if (!userInfo.value) {
    store.dispatch('getUserInfo');
  }

  return userInfo;
}

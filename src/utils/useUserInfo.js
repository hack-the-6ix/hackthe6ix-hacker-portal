import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';

export default function useUserInfo() {
  const store = useStore();
  const userInfo = computed(() => store.state.userInfo);
  const loaded = ref(false);

  watch(userInfo, (val) => {
    if (val !== null) {
      loaded.value = true;
    }
  });

  if (!userInfo.value) {
    store.dispatch('getUserInfo');
  }

  return {
    userInfo,
    loaded,
  };
}

import { getProfile } from "../utils/api";

const userStore = {
  state() {
    return {
      userInfo: null,
    };
  },
  actions: {
    getUserInfo({ state, commit }) {
      if (!state.userInfo) {
        commit('fetchUserInfo');
      }
    },
  },
  mutations: {
    async fetchUserInfo(state) {
      const res = await getProfile();
      state.userInfo = res.data;
    },
  },
};

export default userStore;

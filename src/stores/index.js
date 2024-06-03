import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      userPK: null // 유저의 PK 값
    };
  },
  mutations: {
    setUserPK(state, pk) {
      state.userPK = pk;
    }
  },
  actions: {
    setUserPK({ commit }, pk) {
      commit('setUserPK', pk);
    }
  },
  getters: {
    getUserPK(state) {
      return state.userPK;
    }
  }
});

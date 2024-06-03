import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null,
    // token: null
  }),
  actions: {
    // login(userId, token) {
    login(userId) {
      this.userId = userId;
      // this.token = token;
    },
    logout() {
      this.userId = null;
      // this.token = null;
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.userId,
  },
});
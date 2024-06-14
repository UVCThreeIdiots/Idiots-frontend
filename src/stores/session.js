// stores/session.js
import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
  state: () => ({
    isSessionExpired: false,
  }),
  actions: {
    checkSession() {
      const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('mySessionName='));
      
      if (!sessionCookie) {
        this.isSessionExpired = true;
      } else {
        this.isSessionExpired = false;
      }
    },
    setSessionExpired(status) {
      this.isSessionExpired = status;
    }
  },
});

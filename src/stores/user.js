import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    name: '',
  }),
  actions: {
    setUser(id, name) {
      console.log('setUser', id, name);
      this.id = id;
      this.name = name;
      console.log('setUser', this.id, this.name);
    },
    logout() {
      this.id = null;
      this.name = '';
    },
    getUser() {
      const user = { id : this.id, name : this.name };
      return user;
    },
  },
  persist: {
    enabled: true,
  },
});

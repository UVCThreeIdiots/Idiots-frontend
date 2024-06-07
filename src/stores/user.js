import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    name: '',
    admin: '',
  }),
  actions: {
    setUser(id, name, admin) {
      console.log('setUser', id, name, admin);
      this.id = id;
      this.name = name;
      this.admin = admin;
      console.log('setUser', this.id, this.name);
    },
    logout() {
      this.id = null;
      this.name = '';
      this.admin = null;
      window.localStorage.clear();
    },
    getUser() {
      const user = { id : this.id, name : this.name, admin : this.admin };
      return user;
    },
  },
  persist: {
    enabled: true,
  },
});

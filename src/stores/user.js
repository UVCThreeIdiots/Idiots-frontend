import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    userId: '',
    name: '',
    admin: '',
  }),
  actions: {
    setUser(id, userId, name, admin) {
      console.log('setUser', id, userId, name, admin);
      this.id = id;
      this.userId = userId;
      this.name = name;
      this.admin = admin;
      console.log('setUser', this.id, this.userId, this.name);
    },
    logout() {
      this.id = null;
      this.userId = '';
      this.name = '';
      this.admin = null;
      window.localStorage.clear();
    },
    getUser() {
      const user = { id : this.id, userId : this.userId, name : this.name, admin : this.admin };
      return user;
    },
  },
  persist: {
    enabled: true,
  },
});

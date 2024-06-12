import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    userId: '',
    name: '',
    role: '',
  }),
  actions: {
    setUser(id, userId, name, role) {
      console.log('setUser', id, userId, name, role);
      this.id = id;
      this.userId = userId;
      this.name = name;
      this.role = role;
      console.log('setUser', this.id, this.userId, this.name);
    },
    logout() {
      this.id = null;
      this.userId = '';
      this.name = '';
      this.role = null;
      window.localStorage.clear();
    },
    getUser() {
      const user = { id : this.id, userId : this.userId, name : this.name, role : this.role };
      return user;
    },
  },
  persist: {
    enabled: true,
  },
});

import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    userId: '',
    name: '',
    role: '',
    mode: '',
  }),
  actions: {
    setUser(id, userId, name, role, mode) {
      console.log('setUser', id, userId, name, role, mode);
      this.id = id;
      this.userId = userId;
      this.name = name;
      this.role = role;
      this.mode = mode;

      console.log('setUser', this.id, this.userId, this.name, this.mode);
    },
    logout() {
      this.id = null;
      this.userId = '';
      this.name = '';
      this.role = null;
      this.mode = null;
      window.localStorage.clear();
    },
    getUser() {
      const user = { id : this.id, userId : this.userId, name : this.name, role : this.role, mode : this.mode};
      return user;
    },
  },
  persist: {
    enabled: true,
  },
});

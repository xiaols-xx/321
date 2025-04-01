import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    setUser(userData) {
      this.user = userData
    },
    setToken(token) {
      this.token = token
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
    initialize() {
      // 初始化时从 localStorage 恢复状态
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
      }
    }
  },
  persist: true // 启用状态持久化
})
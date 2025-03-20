import { defineStore } from 'pinia';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    initialize() {
      try {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')

        if (token) {
          this.setToken(token)
        }

        if (userStr) {
          const user = JSON.parse(userStr)
          this.setUser(user)
        }
      } catch (error) {
        console.error('初始化 store 失败:', error)
        this.setToken(null)
        this.setUser(null)
      }
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
      console.log('保存 token:', this.token); // 调试代码
    },

    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      console.log('保存用户:', this.user); // 调试代码 
    },

    async logout() {
      try {
        await axios.post('/api/auth/logout',null,{headers: {'Authorization': `Bearer ${this.token}`}})
         // 清除本地状态
         this.token = null;
         this.user = null;
         localStorage.removeItem('token');
         localStorage.removeItem('user');
  // 清除 axios 默认请求头
  delete axios.defaults.headers.common['Authorization'];
        ElMessage.success('登出成功')
      } catch (error) {
        console.error('登出请求失败:', error);
        throw error;  
      } finally {
        // 确保清除用户状态并重定向到登录页面
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }}
  },
  
});
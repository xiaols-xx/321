<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            v-model="username"
            type="text"
            placeholder="用户名"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="password"
            type="password"
            placeholder="密码"
            required
          />
        </div>
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/authStore';
import axios from 'axios';

const router = useRouter();
const store = useUserStore();

const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  try {
    error.value = '';
    isLoading.value = true;
    console.log('开始登录请求...', {
      username: username.value,
      password: password.value
    });

    const response = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value
    });

    console.log('登录响应:', response.data);

    // 检查响应中是否包含 token
    if (response.data.token) {
      // 保存 token 和用户信息
      store.setToken(response.data.token);
      store.setUser({
        username: response.data.username
      });
      
      // 设置 axios 默认 headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      console.log('登录成功，准备跳转', {
        token: store.token,
        user: store.user
      });
      
      // 跳转到首页
      await router.push('/');
    } else {
      error.value = '登录失败：未收到有效的 token';
      console.error('登录响应中没有 token:', response.data);
    }
  } catch (err) {
    console.error('登录错误:', err);
    error.value = err.response?.data?.message || '登录失败，请重试';
  } finally {
    isLoading.value = false;
  }
};
</script>
 

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #1557b0;
}

button:disabled {
  background-color: #9aa0a6;
  cursor: not-allowed;
}

.error-message {
  color: #d93025;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
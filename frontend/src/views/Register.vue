<template>
  <div class="register-container">
    <h1 class="register-title">注册</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <input v-model="username" placeholder="用户名" required class="form-input" />
      </div>
      <div class="form-group">
        <input v-model="password" type="password" placeholder="密码" required class="form-input" />
      </div>
      <button type="submit" class="register-btn">注册</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();
axios.defaults.baseURL = 'http://localhost:8000';
const register = async () => {
  try {
    console.log('发送注册请求到:', '/api/auth/register');
    console.log('请求数据:', { username: username.value, password: password.value });
    const response = await axios.post('/api/auth/register', {
      username: username.value,
      password: password.value
    });
    console.log('注册响应:', response.data); // 添加日志
    router.push('/login');
  } catch (error) {
    console.error('注册错误:', error.response?.data || error.message);
    // 可以添加错误提示
    alert(error.response?.data?.message || '注册失败，请重试');
  }
};
</script>

<style>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7fafc;
}

.register-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1a202c;
}

.form-group {
  width: 300px;
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.register-btn {
  padding: 1rem 2rem;
  background-color: #4299e1;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-btn:hover {
  background-color: #2b6cb0;
}
</style>
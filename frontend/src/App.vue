<template>
  <div id="app">
    <nav class="navbar">
      <div class="logo-container">
        <img src="./assets/logo1.png" alt="Logo" class="logo" />
        <span class="slogan">轻松设计, 灵感无限</span>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <!-- 未登录时显示 -->
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="nav-link">登录</router-link>
          <router-link to="/register" class="nav-link">注册</router-link>
        </template>
        <!-- 登录后显示 -->
        <template v-else>
          <div class="user-info">
            <span class="welcome">欢迎，</span>
            <span class="username">{{ username }}</span>
            <button @click="handleLogout" class="logout-btn">退出登录</button>
          </div>
        </template>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './store/authStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const store = useUserStore();

// 使用 storeToRefs 来保持响应性
const { user } = storeToRefs(store);

// 计算属性
const isLoggedIn = computed(() => store.isLoggedIn);
const username = computed(() => store.user?.username || '未登录');

// 登出处理
const handleLogout = async () => {
  try {
    // 清除用户数据
    await store.logout();
    // 跳转到登录页
     router.push('/login');
  } catch (error) {
    console.error('登出错误:', error);
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1a202c;
  color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 40px;
  width: auto;
}

.slogan {
  font-size: 1.2rem;
  font-weight: 300;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome {
  color: #cbd5e0;
}

.username {
  color: #63b3ed;
  font-weight: 500;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid #cbd5e0;
  color: #cbd5e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background-color: #cbd5e0;
  color: #1a202c;
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: 500;
}
</style>
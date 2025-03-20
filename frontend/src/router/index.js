import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../store/authStore';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',  // 添加注册路由
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const store = useUserStore();
  console.log('路由守卫检查:', {
    isLoggedIn: store.isLoggedIn,
    path: to.path,
    requiresAuth: to.meta.requiresAuth
  });

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next('/login');
    return;
  }

  next();
});

export default router;
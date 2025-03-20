import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css' 
import axios from 'axios'
import { useUserStore } from './store/authStore';
import ElementPlus from 'element-plus'
import '@fortawesome/fontawesome-free/css/all.min.css';
const app = createApp(App)
const pinia = createPinia()

// 添加持久化插件
pinia.use(piniaPluginPersistedstate)

// 配置 axios
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true; // 如果需要携带 cookie
// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 注册 pinia
app.use(pinia)

 

// 注册路由
app.use(router)

// 路由守卫
router.beforeEach((to, from, next) => {
  const store = useUserStore()
  store.initialize(); // 初始化 store
  if (to.meta.requiresAuth && !store
    .isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

app.mount('#app')
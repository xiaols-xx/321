// tests/router.spec.js
import { createRouter } from '../router'

test('未登录用户访问受保护路由应跳转登录页', async () => {
  const router = createRouter()
  await router.push('/')
  expect(router.currentRoute.value.path).toBe('/login')
})
// tests/api.spec.js
import { fetchUser } from '../api'

test('成功获取用户数据应更新store', async () => {
  // Mock axios
  jest.mock('../utils/request', () => ({
    get: () => Promise.resolve({ data: { id: 1, name: 'test' } })
  }))

  await authStore.fetchUser()
  expect(authStore.user.name).toBe('test')
})
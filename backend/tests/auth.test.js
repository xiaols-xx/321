// tests/middlewares/auth.test.js
const request = require('supertest')
const app = require('../../app')

test('未带token访问受保护路由应返回401', async () => {
  const res = await request(app).get('/api/generate')
  expect(res.statusCode).toBe(401)
})
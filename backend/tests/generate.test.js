// tests/routes/generate.test.js
test('合法prompt应返回图片URL', async () => {
    const res = await request(app)
      .post('/api/generate')
      .send({ prompt: 'a cat' })
      .set('Authorization', validToken)
    
    expect(res.body).toHaveProperty('imageUrl')
  })
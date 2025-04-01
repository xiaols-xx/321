// tests/services/chatService.test.js
describe('历史记录操作', () => {
    let testConn
  
    beforeAll(() => {
      // 创建测试数据库连接
      testConn = createTestDatabase()
    })
  
    afterEach(async () => {
      // 清理测试数据
      await testConn.query('DELETE FROM history WHERE user_id = 999')
    })
  
    test('应能正确创建历史记录', async () => {
      const record = await createHistory(testConn, 999, 'test')
      expect(record.id).toBeDefined()
    })
  })
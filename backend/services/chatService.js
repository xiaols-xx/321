const db = require('../db');
const crypto = require('crypto');

class ChatService {
  constructor() {
    // 绑定方法时添加错误处理
    this.saveMessage = this.wrapAsync(this.saveMessage);
    this.getChatHistory = this.wrapAsync(this.getChatHistory);
    this.cleanupExpiredMessages = this.wrapAsync(this.cleanupExpiredMessages);
    this.getLastSession = this.wrapAsync(this.getLastSession);
    this.updateMessageExpiry = this.wrapAsync(this.updateMessageExpiry);
  }

  // 统一的异步包装器
  wrapAsync(fn) {
    return async (...args) => {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        console.error(`操作失败: ${fn.name}`, error);
        throw error;
      }
    };
  }

  async saveMessage(userId, type, content, imageUrl = null) {
    let sessionId = await this.getLastSession(userId);
    if (!sessionId) {
      sessionId = this.generateSessionId(userId);
      console.log('生成新会话ID:', sessionId);
    }

    const [result] = await db.execute(
      `INSERT INTO chat_messages 
        (user_id, type, content, image_url, session_id, expires_at)
       VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 MONTH ))`,
      [userId, type, content, imageUrl, sessionId]
    );

    console.log('消息保存成功:', { insertId: result.insertId });
    return result.insertId;
  }

  async getChatHistory(userId) {
    const [rows] = await db.execute(
      `SELECT id, type, content, image_url, created_at
       FROM chat_messages
       WHERE user_id = ? AND expires_at > NOW()
       ORDER BY created_at ASC`,
      [userId]
    );

    return rows.map(row => ({
      ...row,
      created_at: new Date(row.created_at).toISOString()
    }));
  }

  async cleanupExpiredMessages() {
    const [result] = await db.execute(
      'DELETE FROM chat_messages WHERE expires_at < NOW()'
    );
    console.log('清理过期消息:', { affectedRows: result.affectedRows });
    return result.affectedRows;
  }

  async getLastSession(userId) {
    const [rows] = await db.execute(
      `SELECT session_id 
       FROM chat_messages 
       WHERE user_id = ?
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );
    return rows[0]?.session_id;
  }

  async updateMessageExpiry(messageId, hours = 24) {
    const [result] = await db.execute(
      `UPDATE chat_messages 
       SET expires_at = DATE_ADD(NOW(), INTERVAL ? HOUR)
       WHERE id = ?`,
      [hours, messageId]
    );
    return result.affectedRows > 0;
  }

  generateSessionId(userId) {
    return `${userId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }
}

module.exports = new ChatService();
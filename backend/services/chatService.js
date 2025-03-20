const db = require('../db');
const crypto = require('crypto');

class ChatService {
  constructor() {
    // 在构造函数中绑定方法到实例
    this.getCurrentSessionId = this.getCurrentSessionId.bind(this);
    this.saveMessage = this.saveMessage.bind(this);
    this.getChatHistory = this.getChatHistory.bind(this);
    this.cleanupExpiredMessages = this.cleanupExpiredMessages.bind(this);
    this.getLastSession = this.getLastSession.bind(this);
    this.updateMessageExpiry = this.updateMessageExpiry.bind(this);
  }

  getCurrentSessionId(userId) {
    return `${userId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  saveMessage(userId, type, content, imageUrl = null) {
    return new Promise((resolve, reject) => {
      try {
        const sessionId = this.getCurrentSessionId(userId);
        console.log('Generated sessionId:', sessionId); // 调试日志

        const query = `
          INSERT INTO chat_messages (
            user_id, 
            type, 
            content, 
            image_url, 
            session_id,
            expires_at
          )
          VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))
        `;
        
        const params = [userId, type, content, imageUrl, sessionId];
        console.log('Query params:', params); // 调试日志

        db.query(query, params, (err, result) => {
          if (err) {
            console.error('保存消息失败:', err);
            reject(err);
          } else {
            resolve(result.insertId);
          }
        });
      } catch (error) {
        console.error('saveMessage 执行错误:', error);
        reject(error);
      }
    });
  }

  // 其他方法保持不变
  getChatHistory(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          id,
          type,
          content,
          image_url,
          session_id,
          created_at,
          expires_at
        FROM chat_messages 
        WHERE user_id = ? 
          AND expires_at > NOW()
        ORDER BY created_at ASC
      `;
      
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error('获取聊天历史失败:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  cleanupExpiredMessages() {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM chat_messages WHERE expires_at < NOW()';
      
      db.query(query, (err, result) => {
        if (err) {
          console.error('清理过期消息失败:', err);
          reject(err);
        } else {
          resolve(result.affectedRows);
        }
      });
    });
  }

  getLastSession(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT session_id 
        FROM chat_messages 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error('获取最后会话失败:', err);
          reject(err);
        } else {
          resolve(results[0]?.session_id);
        }
      });
    });
  }

  updateMessageExpiry(messageId, hours = 24) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE chat_messages 
        SET expires_at = DATE_ADD(NOW(), INTERVAL ? HOUR) 
        WHERE id = ?
      `;
      
      db.query(query, [hours, messageId], (err, result) => {
        if (err) {
          console.error('更新消息过期时间失败:', err);
          reject(err);
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
  }
}

// 创建单个实例并导出
const chatService = new ChatService();
module.exports = chatService;
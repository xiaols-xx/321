const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// 中间件：验证JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: '未提供认证token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'token无效或已过期' });
    }
};
// 保存聊天记录
router.post('/', async (req, res) => {
    const { type, content, created_at } = req.body;
    const user_id = req.user.id; // 假设你有用户认证
  
    try {
      await db.execute(
        'INSERT INTO chat_messages (user_id, type, content, created_at) VALUES (?, ?, ?, ?)',
        [user_id, type, content, created_at]
      );
      res.status(200).json({ message: '历史记录已保存' });
    } catch (error) {
      console.error('保存聊天记录失败:', error);
      res.status(500).json({ message: '保存聊天记录失败' });
    }
  });
// 获取聊天历史记录
router.get('/', authenticateToken, async (req, res) => {
    try {
         const userId = req.user.id;
        console.log('获取历史记录，用户ID:', userId);

        // 修改 SQL 查询以匹配实际的表结构
        // 第一个表使用 type，第二个表使用 message_type
        const [messageRows] = await db.execute(
            `(SELECT type as message_type, content, image_url, created_at 
              FROM chat_messages 
              WHERE user_id = ?)
             ORDER BY created_at DESC`,
            [userId]
        );

        console.log('查询结果:', {
            userId,
            messageCount: messageRows?.length || 0
        });

        // 统一返回格式
        const formattedHistory = messageRows.map(row => ({
            type: row.message_type,
            content: row.content,
            image_url: row.image_url,
            created_at: row.created_at
        }));

        res.json({
            success: true,
            history: formattedHistory
        });
    } catch (error) {
        console.error('获取聊天历史失败:', error);
        res.status(500).json({
            success: false,
            message: '获取聊天历史记录失败',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
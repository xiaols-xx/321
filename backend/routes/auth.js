const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const db = require('../db');
const router = express.Router();
const auth = require('../middlewares/auth');

// 注册路由（已修复）
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. 参数校验
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    // 2. 检查用户名是否已存在
    const [existingUser] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 3. 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 创建用户
    await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ? )',
      [username, hashedPassword]
    );

    // 5. 返回成功响应
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    console.error('注册过程出错:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// 登录路由
router.post('/login', async (req, res) => { // 关键修复点：添加 async
  const { username, password } = req.body;

  try {
    // 1. 参数校验
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' });
    }

    // 2. 查询用户
    const [results] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    // 3. 用户不存在
    if (results.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: '用户名或密码错误' 
      });
    }

    const user = results[0];

    // 4. 验证密码
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        message: '用户名或密码错误' 
      });
    }

    // 5. 生成 JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username 
      },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 6. 返回响应
    res.json({
      success: true,
      token,
      username: user.username,
      userId: user.id
    });

  } catch (error) {
    console.error('登录过程出错:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 登出路由（保持不变）
router.post('/logout', auth, async (req, res) => {
  try {
    res.status(200).json({ message: '登出成功' });
  } catch (error) {
    console.error('登出过程出错:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}); 

module.exports = router;
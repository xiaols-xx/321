const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const db = require('../db');
const router = express.Router();
const auth = require('../middlewares/auth');
// 注册路由
router.post('/register', async (req, res) => {
  console.log('收到注册请求:', req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  try {
    // 检查用户名是否已存在
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('数据库查询错误:', err);
        return res.status(500).json({ message: '服务器错误' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: '用户名已存在' });
      }

      // 加密密码
      const hashedPassword = bcrypt.hashSync(password, 8);

      // 创建新用户
      db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err) => {
          if (err) {
            console.error('创建用户错误:', err);
            return res.status(500).json({ message: '服务器错误' });
          }
          res.status(201).json({ message: '注册成功' });
        }
      );
    });
  } catch (error) {
    console.error('注册过程出错:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 登录路由
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) {
        console.error('数据库查询错误:', err);
        return res.status(500).json({ message: '服务器错误' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      const user = results[0];

      // 验证密码
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 创建 token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        username: user.username
      });
    }
  );
  
});

// 登出路由
router.post('/logout', auth, async (req, res) => {
  try {
      const userId = req.user.id;
      
      // 如果你需要在数据库中记录登出状态或清除会话，可以在这里添加相关代码
      // 例如：await db.execute('UPDATE user_sessions SET logged_out = NOW() WHERE user_id = ?', [userId]);
      
      res.json({
          success: true,
          message: '登出成功'
      });
  } catch (error) {
      console.error('处理登出请求失败:', error);
      res.status(500).json({
          success: false,
          message: '登出处理失败'
      });
  }
});
module.exports = router;
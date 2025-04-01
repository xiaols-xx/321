const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');
const historyRoutes = require('./routes/history');
const app = express();
const bodyParser = require('body-parser');

// CORS 配置
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use(bodyParser.json());

// 请求日志中间件
 app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, {
    headers: req.headers,
    body: req.body,
    query: req.query,
    ip: req.ip
  });
  next();
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/history', historyRoutes); // 将 historyRoutes 改为 /api/history
 // 静态文件服务 - 确保这行在路由配置之前
app.use('/static', express.static(path.join(__dirname, 'generate-image')));
console.log('静态文件目录:', path.join(__dirname, 'generate-image'));
// 错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false,
    message: '服务器错误' 
  });
});

// 在后端添加定时任务
const cron = require('node-cron');

// 每天凌晨清理过期消息
cron.schedule('0 0 * * *', async () => {
  try {
    await db.query('DELETE FROM chat_messages WHERE expires_at < NOW()');
    console.log('已清理过期消息');
  } catch (error) {
    console.error('清理过期消息失败:', error);
  }
});

module.exports = app;
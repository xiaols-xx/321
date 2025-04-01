const mysql = require('mysql2/promise');
require('dotenv').config(); // 确保加载环境变量

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试连接
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功！');
    connection.release();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1); // 退出进程
  }
})();

 

// 处理连接池中的连接错误
pool.on('error', (err) => {
  console.error('数据库错误:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('重新连接数据库...');
    // 注意：这里不需要手动重新连接，因为连接池通常会自动处理这种情况。
  }
});

module.exports = pool;
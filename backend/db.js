const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // 确保这是正确的用户名
  password: '123456789', // 确保这是正确的密码
  database: 'ai_drawing' // 确保数据库已创建
});

// 添加错误处理
connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
    return;
  }
  console.log('数据库连接成功');
});

// 处理连接丢失
connection.on('error', (err) => {
  console.error('数据库错误:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('重新连接数据库...');
    connection.connect();
  }
});

module.exports = connection;
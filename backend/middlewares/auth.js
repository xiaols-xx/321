const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: '未提供认证令牌' 
      });
    }

    // 验证 token 格式
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: '无效的认证令牌格式' 
      });
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 将用户信息添加到请求对象中
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('认证错误:', error);
    return res.status(401).json({ 
      success: false, 
      message: '无效的认证令牌' 
    });
  }
};

module.exports = auth;
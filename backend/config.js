require('dotenv').config();

module.exports = {
    DASHSCOPE_API_KEY: process.env.DASHSCOPE_API_KEY ,
    JWT_SECRET: process.env.JWT_SECRET || '123',
    NODE_ENV: process.env.NODE_ENV || 'development',
    // 添加API相关配置
}
require('dotenv').config();

module.exports = {
    STABILITY_API_KEY: process.env.STABILITY_API_KEY || 'sk-tHlVl5wbvlbZjPmdvftkBBITjbDw8sDlafh6f4sDUTDbvHe4',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    NODE_ENV: process.env.NODE_ENV || 'development',
    // 添加API相关配置
    API: {
        STABILITY: {
            BASE_URL: 'https://api.stability.ai',
            VERSION: 'v2beta',
            ENDPOINT: '/stable-image/generate/sd3'
        }
    }
};
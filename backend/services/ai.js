const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');
const config = require('../config');
const https = require('https');
class AIService {
    constructor() {
        this.apiUrl = `${config.API.STABILITY.BASE_URL}/${config.API.STABILITY.VERSION}${config.API.STABILITY.ENDPOINT}`;
        this.apiKey = config.STABILITY_API_KEY;
        this.outputDir = path.join(__dirname, '../generate-image');
        this.maxRetries = 3;
        this.timeout = 120000;
            // 配置 HTTPS agent
            this.httpsAgent = new https.Agent({
              rejectUnauthorized: false, // 注意：仅在测试环境使用
              keepAlive: true,
              timeout: 60000
          });
        // 确保输出目录存在
        this.initializeOutputDir();
    }

    async initializeOutputDir() {
        try {
            await fs.access(this.outputDir);
        } catch (error) {
            await fs.mkdir(this.outputDir, { recursive: true });
            console.log('Created output directory:', this.outputDir);
        }
    }

    async generateImage(description, retryCount = 0) {
        if (!this.apiKey) {
            throw new Error('API Key 未配置');
        }

        try {
            console.log('开始生成图片，描述:', description);

            const formData = new FormData();
            const params = {
                prompt: description,
                output_format: 'png',
                width: 1024,
                height: 1024,
                steps: 30,
                cfg_scale: 7,
                samples: 1
            };

            Object.entries(params).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const requestConfig = {
                method: 'post',
                url: this.apiUrl,
                data: formData,
                headers: {
                    ...formData.getHeaders(),
                    'Accept': 'image/*',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'arraybuffer',
                timeout: this.timeout,
                validateStatus: null // 允许所有状态码
            };

            const response = await axios(requestConfig);

            // 处理非成功状态码
            if (response.status !== 200) {
                let errorMessage = 'API请求失败';
                if (response.data) {
                    try {
                        const textDecoder = new TextDecoder('utf-8');
                        const errorJson = JSON.parse(textDecoder.decode(response.data));
                        errorMessage = errorJson.message || JSON.stringify(errorJson);
                    } catch (e) {
                        errorMessage = `状态码: ${response.status}`;
                    }
                }
                throw new Error(errorMessage);
            }

            // 验证响应数据
            if (!response.data || !Buffer.isBuffer(response.data)) {
                throw new Error('API返回了无效的响应数据');
            }

            // 生成文件名和保存图片
            const timestamp = Date.now();
            const fileName = `generated_${timestamp}_${Math.random().toString(36).substr(2, 9)}.png`;
            const filePath = path.join(this.outputDir, fileName);

            await fs.writeFile(filePath, response.data);
            
            // 验证保存的文件
            const stats = await fs.stat(filePath);
            if (stats.size === 0) {
                throw new Error('保存的图片文件大小为0');
            }

            console.log('生成成功:', {
                path: filePath,
                size: stats.size,
                url: `/generated/${fileName}`
            });

            return `/generated/${fileName}`;

        } catch (error) {
            console.error('图片生成错误:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data ? '(Binary Data)' : undefined
            });

            // 特定错误处理
            if (error.response?.status === 401) {
                throw new Error('API认证失败，请检查API Key');
            }
            if (error.response?.status === 403) {
                throw new Error('访问被拒绝，请检查API权限');
            }
            if (error.response?.status === 400) {
                throw new Error('请求参数错误，请检查输入');
            }

            // 重试逻辑
            if (retryCount < this.maxRetries && 
                (error.code === 'ECONNREFUSED' || 
                 error.code === 'ECONNRESET' || 
                 error.code === 'ETIMEDOUT')) {
                const waitTime = Math.pow(2, retryCount) * 2000;
                console.log(`等待${waitTime/1000}秒后重试...(${retryCount + 1}/${this.maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return this.generateImage(description, retryCount + 1);
            }

            throw error;
        }
    }

    async testConnection() {
        try {
            const formData = new FormData();
            formData.append('prompt', 'test connection');
            formData.append('output_format', 'png');
            formData.append('width', '512');
            formData.append('height', '512');
            formData.append('steps', '30');
            formData.append('samples', '1');

            const response = await axios({
                method: 'post',
                url: this.apiUrl,
                data: formData,
                headers: {
                    ...formData.getHeaders(),
                    'Accept': 'image/*',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                responseType: 'arraybuffer',
                timeout: 5000,
                validateStatus: null
            });

            return {
                success: response.status === 200,
                status: response.status,
                message: response.status === 200 ? '连接测试成功' : '连接测试失败'
            };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status || 500,
                message: `连接测试失败: ${error.message}`
            };
        }
    }
}

// 创建单例实例
const aiService = new AIService();
module.exports = aiService;
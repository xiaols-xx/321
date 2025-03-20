const axios = require('axios');

class StabilityAIService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: 'https://api.stability.ai/v2beta',
      headers: {
        Authorization: `Bearer sk-tHlVl5wbvlbZjPmdvftkBBITjbDw8sDlafh6f4sDUTDbvHe4`, // 替换为你的 API Key
        'Content-Type': 'application/json'
      }
    });
  }

  async generateImage(prompt) {
    try {
      const response = await this.apiClient.post('/stable-image/generate/sd3', {
        text_prompts: [{ text: prompt }],
        steps: 50,
        width: 512,
        height: 512
      });
      
      return response.data;
    } catch (error) {
      console.error('StabilityAI API Error:', error);
      throw new Error('图片生成失败');
    }
  }
}

module.exports = new StabilityAIService();
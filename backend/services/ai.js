const axios = require('axios');
const config = require('../config');

class AIService {
  constructor() {
    // DashScope 接口配置
    this.apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
    this.taskUrl = (taskId) => `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`;
    this.apiKey = config.DASHSCOPE_API_KEY; // 确保config中的字段名正确
    this.pollInterval = 5000;
    this.maxPollAttempts = 20;
    // 定义支持的图片尺寸
    this.allowedSizes = [
      '512*1024', '768*512', '768*1024', 
      '1024*576', '576*1024', '1024*1024'
    ];
  }

  async generateImageWithFlux(prompt, params = {}) {
    // 设置默认值
    if (!params.size) {
      params.size = "1024*1024";
    }

    this.validateParameters(params); // 添加参数验证

    const response = await axios.post(
      this.apiUrl,
      {
        model: "flux-merged", // 修改为新的模型名称
        input: { prompt: prompt },
        parameters: {
          size: params.size,
          seed: params.seed ?? Math.floor(Math.random() * 1000),
          steps: params.steps ?? 30, // flux-merged 模型默认 steps 为 30
          guidance: params.guidance ?? 3.5,
          offload: Boolean(params.offload),
          add_sampling_metadata: Boolean(params.addSamplingMetadata)
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-DashScope-Async': 'enable',
          'X-DashScope-ServerTimeout': '300',
        }
      }
    );

    if (!response.data.output?.task_id) {
      throw new Error(`任务提交失败: ${JSON.stringify(response.data)}`);
    }

    return {
      taskId: response.data.output.task_id,
      requestId: response.data.request_id,
      status: response.data.output.task_status
    };
  }

  async checkAsyncTask(taskId) {
    try {
      const response = await axios.get(this.taskUrl(taskId), {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (response.data.code || response.data.output?.task_status === 'FAILED') {
        console.error('任务状态失败:', response.data);
        throw new Error(response.data.code ? response.data.message : '任务失败，状态未知');
      }

      return response.data.output;
    } catch (error) {
      console.error('检查任务状态时出错:', error);
      return null;
    }
  }

  async pollTaskStatus(taskId) {
    let attempts = 0;
    while (attempts < this.maxPollAttempts) {
      const result = await this.checkAsyncTask(taskId);

      if (result) {
        console.log(`当前轮询状态: ${result.task_status}`);

        if (result.task_status === 'SUCCEEDED') {
          return this.handleSuccessResult(result);
        }
        if (result.task_status === 'FAILED') {
          throw new Error(`任务失败: ${result.message}`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, this.pollInterval));
      attempts++;
    }
    throw new Error('任务超时未完成');
  }

  handleSuccessResult(result) {
    if (!result.results || result.results.length === 0) {
      throw new Error('生成结果为空');
    }

    const imageUrl = result.results[0].url;

    if (result.metadata) {
      console.log('生成元数据:', result.metadata);
    }

    return imageUrl;
  }

  validateParameters(params) {
    const validSizes = [
      "512*1024", "768*512", "768*1024",
      "1024*576", "576*1024", "1024*1024"
    ];

    if (!validSizes.includes(params.size)) {
      throw new Error(`无效分辨率: ${params.size}`);
    }

    if (params.steps < 1 || params.steps > 50) {
      throw new Error("steps参数需在1-50之间");
    }
  }
}

module.exports = new AIService();
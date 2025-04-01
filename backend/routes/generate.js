const express = require('express');
const router = express.Router();
const aiService = require('../services/ai');
const chatService = require('../services/chatService');
const auth = require('../middlewares/auth');

router.post('/', auth, async (req, res) => {
  try {
    console.log('收到图片生成请求:', req.body);
    const { prompt, params = {} } = req.body;
    const userId = req.user.id;

    if (!prompt) {
      console.log('请求缺少图片描述');
      return res.status(400).json({
        success: false,
        message: '请提供图片描述'
      });
    }

    console.log('开始保存用户消息');
    await chatService.saveMessage(userId, 'user', prompt);
    console.log('用户消息已保存');

    console.log('提交异步生成任务');
    const { taskId, status } = await aiService.generateImageWithFlux(prompt, params);
    console.log(`任务已提交，ID: ${taskId}, 初始状态: ${status}`);

    console.log('开始轮询任务状态');
    let attempts = 0;
    const maxAttempts = 60; // 增加最大轮询次数
    const pollInterval = 10000; // 增加轮询间隔
    
    while (attempts < maxAttempts) {
      const taskResult = await aiService.checkAsyncTask(taskId);
      console.log(`轮询次数: ${attempts + 1}, API返回:`, taskResult);
    
      if (!taskResult) {
        console.log('API未返回任何数据，等待重试...');
      } else if (taskResult.task_status && typeof taskResult.task_status !== 'undefined') {
        const currentStatus = taskResult.task_status;
        console.log(`轮询次数: ${attempts + 1}, 当前状态: ${currentStatus}`);
        if (currentStatus === 'SUCCEEDED') break;
        if (currentStatus === 'FAILED') {
          console.error('任务失败，原因:', taskResult.message);
          throw new Error('图片生成失败');
        }
      } else {
        if (taskResult.error) {
          throw new Error(`图片生成错误: ${taskResult.error}`);
        }
        console.log('API response structure invalid: missing output field, response:', taskResult);
      }
    
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('任务处理超时');
    }

    const taskResult = await aiService.checkAsyncTask(taskId);
    if (!taskResult || !taskResult.results || taskResult.results.length === 0) {
      throw new Error('生成结果无效');
    }

    const imageUrl = taskResult.results[0].url;
    console.log('获取到生成结果:', taskResult);
    console.log('保存AI回复');
    await chatService.saveMessage(userId, 'ai', '已为您生成以下图片：', imageUrl);
    console.log('AI回复已保存');

    res.json({
      success: true,
      message: '图片生成成功',
      image_url: imageUrl
    });

  } catch (error) {
    console.error('图片生成错误:', {
      message: error.message,
      status: error.response?.status,
      stack: error.stack,
      apiError: error.response?.data || 'No API response'
    });

    const statusCode = error.response?.status || 500;
    const errorMessageMap = {
      400: '请求参数错误，请检查输入',
      401: 'API认证失败，请检查API Key',
      403: '访问被拒绝，请检查API权限',
      429: '请求过于频繁，请稍后再试',
      500: '图片生成失败'
    };

    res.status(statusCode).json({
      success: false,
      message: errorMessageMap[statusCode] || error.message
    });
  }
});

router.get('/', (req, res) => {
  res.json({ message: "Generate route works!" });
});

module.exports = router;
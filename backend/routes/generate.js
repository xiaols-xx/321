const express = require('express');
const router = express.Router();
const aiService = require('../services/ai');
const chatService = require('../services/chatService');
const auth = require('../middlewares/auth');

router.post('/generate', auth, async (req, res) => {
  try {
    console.log('收到图片生成请求:', req.body);
    const { description } = req.body;
    const userId = req.user.id;

    if (!description) {
      console.log('请求缺少描述');
      return res.status(400).json({ 
        success: false,
        message: '请提供图片描述' 
      });
    }

    console.log('开始保存用户消息');
    // 保存用户的问题
    await chatService.saveMessage(userId, 'user', description);
    console.log('用户消息已保存');

    console.log('开始生成图片');
    // 生成图片
    const imageUrl = await aiService.generateImage(description);
    console.log('图片生成完成:', imageUrl);
    
    // 保存AI的回复
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
});

module.exports = router;
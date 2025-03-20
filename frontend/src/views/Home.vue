<template>
  <div class="chat-container">
    <!-- 聊天记录区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.type, 'fade-in']">
        
        <!-- 用户消息 -->
        <div v-if="message.type === 'user'" class="user-message">
          <div class="message-content user-content">
            <div class="message-text">{{ message.content }}</div>
          </div>
          <div class="avatar user-avatar">
            <span>{{ getUserInitials() }}</span>
          </div>
        </div>
        
        <!-- AI响应 -->
        <div v-else class="ai-message">
          <div class="avatar ai-avatar">
            <span>AI</span>
          </div>
          <div class="message-content ai-content">
            <div class="typing-indicator" v-if="isGenerating && index === messages.length - 1">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div v-else>
              <div class="message-text">{{ message.content }}</div>
              <div v-if="message.image_url" class="image-container">
                <img 
                  :src="message.image_url" 
                  alt="Generated Image"
                  class="generated-image"
                  @load="handleImageLoad"
                />
                <div class="image-overlay">
                  <button class="download-btn" @click="downloadImage(message.image_url)">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area" :class="{ 'is-generating': isGenerating }">
      <div class="input-wrapper">
        <textarea
          v-model="userInput"
          placeholder="描述你想要的图片..."
          @keydown.enter.prevent="handleSubmit"
          :disabled="isGenerating"
          class="input-field"
          rows="1"
          @input="autoGrow"
          ref="inputField"
        ></textarea>
        <button 
          @click="handleSubmit"
          :disabled="isGenerating || !userInput.trim()"
          class="send-button"
          :class="{ 'is-generating': isGenerating }"
        >
          <span class="button-text">{{ isGenerating ? '生成中' : '发送' }}</span>
          <span class="button-icon">
            <i :class="isGenerating ? 'fas fa-circle-notch fa-spin' : 'fas fa-paper-plane'"></i>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useUserStore } from '../store/authStore';
import axios from 'axios';
import { ElMessage } from 'element-plus';
const store = useUserStore();
const userInput = ref('');
const messages = ref([]);
const isGenerating = ref(false);
const messagesContainer = ref(null);
const inputField = ref(null);

// 获取用户首字母
const getUserInitials = () => {
  const username = store.user?.username || 'User';
  return username.charAt(0).toUpperCase();
};

// 自动调整输入框高度
const autoGrow = () => {
  const element = inputField.value;
  element.style.height = 'auto';
  element.style.height = element.scrollHeight + 'px';
};

// 处理图片加载
const handleImageLoad = () => {
  scrollToBottom();
};

// 下载图片
const downloadImage = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
    throw new Error('图片下载失败');
  }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('下载失败:', error);
  }
};

// 保存聊天记录的方法
const saveChatMessage = async (messageData) => {
  try {
    const token = store.user?.token;
    if (!token) return;

    await axios.post('/api/generate/history', messageData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('保存聊天记录失败:', error);
  }
};

// 加载聊天历史
const loadChatHistory = async () => {
  try {
    if (!store.isLoggedIn) {
      console.log('用户未登录，跳过加载聊天历史');
      return;
    }

    const response = await axios.get('/api/generate/history', {
      headers: {
        'Authorization': `Bearer ${store.token}`
      }
    });
    
    if (response.data.success) {
      messages.value = response.data.history || [];
      await nextTick();
      scrollToBottom();
    }
  } catch (error) {
    console.error('获取聊天历史失败:', error);
    if (error.response?.status === 401) {
      await store.logout();
    } else {
      ElMessage.error('加载聊天历史失败');
    }
  }
};

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 处理消息发送
const handleSubmit = async () => {
  if (!userInput.value.trim() || isGenerating.value) return;

  const input = userInput.value;
  userInput.value = '';
  isGenerating.value = true;

  // 立即添加用户消息
  messages.value.push({
    type: 'user',
    content: input,
    created_at: new Date().toISOString()
  });

  // 保存用户消息到历史记录
  await saveChatMessage({
    type: 'user',
    content: input
  });

  // 添加 AI 响应占位
  messages.value.push({
    type: 'ai',
    content: '',
    created_at: new Date().toISOString()
  });

  await nextTick();
  scrollToBottom();

  try {
    const token = store.token;
    if (!token) {
      console.error('用户未登录或 token 不存在');
      this.$message.error('请先登录'); // 提示用户登录
      return;
    }

    const response = await axios.post('/api/generate', {
      description: input
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      // 保存 AI 响应到历史记录
      await saveChatMessage({
        type: 'ai',
        content: '图片生成成功！',
        image_url: response.data.image_url
      });

      // 更新最后的 AI 消息
      messages.value[messages.value.length - 1] = {
        type: 'ai',
        content: '图片生成成功！',
        image_url: response.data.image_url,
        created_at: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('生成失败:', error);
    messages.value[messages.value.length - 1] = {
      type: 'ai',
      content: '抱歉，生成失败，请重试。',
      created_at: new Date().toISOString()
      
    };
  } finally {
    isGenerating.value = false;
    await nextTick();
    scrollToBottom();
  }
};

// 组件挂载时加载历史记录
onMounted(() => {
  if (store.isLoggedIn) {
    loadChatHistory();
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  background: linear-gradient(135deg, #e8f5e9 0%, #f8bbd0 100%);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.message {
  display: flex;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

.fade-in {
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message, .ai-message {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.user-message {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.user-avatar {
  background: linear-gradient(135deg, #81c784, #4caf50);
  color: white;
}

.ai-avatar {
  background: linear-gradient(135deg, #f48fb1, #e91e63);
  color: white;
}

.message-content {
  padding: 16px;
  border-radius: 18px;
  max-width: 70%;
  position: relative;
}

.user-content {
  background: linear-gradient(135deg, #4caf50, #81c784);
  color: white;
  border-top-right-radius: 4px;
}

.ai-content {
  background: white;
  color: #333;
  border-top-left-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.message-text {
  line-height: 1.5;
  font-size: 16px;
}

.image-container {
  position: relative;
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  animation: scaleIn 0.5s ease forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.generated-image {
  width: 100%;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.download-btn {
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.download-btn:hover {
  transform: scale(1.1);
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #e0e0e0;
  border-radius: 50%;
  animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.input-area {
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.input-field {
  flex: 1;
  padding: 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  resize: none;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
  min-height: 56px;
  max-height: 150px;
}

.input-field:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

.send-button {
  padding: 0 24px;
  background: linear-gradient(135deg, #4caf50, #81c784);
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  height: 56px;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.send-button.is-generating {
  background: linear-gradient(135deg, #f48fb1, #e91e63);
}

.button-icon {
  font-size: 18px;
}

@media (max-width: 768px) {
  .input-wrapper {
    padding: 0 10px;
  }

  .message-content {
    max-width: 85%;
  }

  .send-button {
    min-width: 100px;
  }
}
</style>
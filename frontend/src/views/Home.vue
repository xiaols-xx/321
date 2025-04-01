<template>
  <div class="main-container">
    <!-- 左侧提示词侧边栏 -->
    <div class="prompt-sidebar">
      <div class="scroll-container">
        <div class="suggestions-category">
          <h3>建筑风格</h3>
          <div class="tags">
            <span
              v-for="style in architecturalStyles"
              :key="style"
              class="tag"
              :class="{ active: selectedTags.includes(style) }"
              @click="handleTagClick(style)"
            >
              {{ style }}
            </span>
          </div>
        </div>

        <div class="suggestions-category">
          <h3>知名建筑师</h3>
          <div class="tags">
            <span
              v-for="architect in architects"
              :key="architect"
              class="tag"
              :class="{ active: selectedTags.includes(architect) }"
              @click="handleTagClick(architect)"
            >
              {{ architect }}
            </span>
          </div>
        </div>

        <div class="suggestions-category">
          <h3>建筑元素</h3>
          <div class="tags">
            <span
              v-for="element in architecturalElements"
              :key="element"
              class="tag"
              :class="{ active: selectedTags.includes(element) }"
              @click="handleTagClick(element)"
            >
              {{ element }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧主内容区 -->
    <div class="main-content">
      <!-- 聊天记录区域 -->
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message-bubble', message.type]"
        >
          <!-- AI消息 -->
          <div v-if="message.type === 'ai'" class="ai-content">
            <div class="avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="message-container">
              <div v-if="message.image_url" class="image-preview">
                <img
                  :src="message.image_url"
                  @load="handleImageLoad"
                  class="generated-image"
                />
                <div class="image-overlay">
                  <button
                    class="download-btn"
                    @click="downloadImage(message.image_url)"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </div>
              <div v-else class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <!-- 用户消息 -->
          <div v-if="message.type === 'user'" class="user-content">
            <div class="message-container">
              <div class="message-text">{{ message.content }}</div>
            </div>
            <div class="avatar">
              {{ getUserInitials() }}
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area" :class="{ 'is-generating': isGenerating }">
        <div class="input-wrapper">
          <div class="input-button-container">
            <textarea
              v-model="userInput"
              placeholder="描述你想要的建筑..."
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
              <span class="button-text">{{ isGenerating ? '生成中...' : '发送' }}</span>
              <span class="button-icon">
                <i :class="isGenerating ? 'fas fa-circle-notch fa-spin' : 'fas fa-paper-plane'"></i>
              </span>
            </button>
          </div>
        </div>
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
const messages = ref([]);
const isGenerating = ref(false);
const messagesContainer = ref(null);
const inputField = ref(null);
const selectedTags = ref([]);
const userInput = ref('');

const architecturalStyles = [
  '现代主义',
  '后现代主义',
  '解构主义',
  '极简主义',
  '古典主义',
  '哥特式',
  '巴洛克',
  '新艺术运动',
  '工业风',
  '生态建筑'
];

const architects = [
  '赖特',
  '密斯·凡·德罗',
  '柯布西耶',
  '扎哈·哈迪德',
  '安藤忠雄',
  '贝聿铭',
  '雷姆·库哈斯',
  '弗兰克·盖里',
  '隈研吾',
  '王澍'
];

const architecturalElements = [
  '玻璃幕墙',
  '中庭',
  '采光顶',
  '木格栅',
  '弧形屋顶',
  '露台',
  '立柱',
  '庭院',
  '天窗',
  '水景'
];

const handleTagClick = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
    userInput.value = userInput.value.trim() + ' ' + tag;
  } else {
    selectedTags.value.splice(index, 1);
    userInput.value = userInput.value.replace(tag, '').trim();
  }
  nextTick(() => {
    autoGrow();
  });
};

const getUserInitials = () => {
  const username = store.user?.username || 'User';
  return username.charAt(0).toUpperCase();
};

const autoGrow = () => {
  const element = inputField.value;
  element.style.height = 'auto';
  element.style.height = element.scrollHeight + 'px';
};

const handleImageLoad = () => {
  scrollToBottom();
};

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

const saveChatMessage = async (messageData) => {
  try {
    const token = store.user?.token;
    if (!token) return;

    await axios.post('/api/history', {
      type:'user',
      content:'input',
      created_at: new Date().toISOString(),
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('保存聊天记录失败:', error);
  }
};

const loadChatHistory = async () => {
  try {
    if (!store.isLoggedIn) {
      console.log('用户未登录，跳过加载聊天历史');
      return;
    }

    const response = await axios.get('/api/history', {
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

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const handleSubmit = async () => {
  if (!userInput.value.trim() || isGenerating.value) return;

  const input = userInput.value;
  userInput.value = '';
  isGenerating.value = true;

  messages.value.push({
    type: 'user',
    content: input,
    created_at: new Date().toISOString()
  });

  await saveChatMessage({
    type: 'user',
    content: input
  });

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
      ElMessage.error('请先登录'); // 提示用户登录
      return; 
    }

    const response = await axios.post('/api/generate', {
      prompt: input
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      await saveChatMessage({
        type: 'ai',
        content: '图片生成成功！',
        image_url: response.data.image_url
      });

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

onMounted(() => {
  if (store.isLoggedIn) {
    loadChatHistory();
  }
});
</script>

<style scoped>
/* 完整样式优化 */
.main-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100vh;
  background: #f5f7fb;
}

.prompt-sidebar {
  background: white;
  border-right: 1px solid #e3e8f1;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.suggestions-category {
  margin-bottom: 24px;
}

.suggestions-category h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  padding-left: 8px;
}

.tags {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.tag {
  background: #f5f5f5;
  color: #666;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 13px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.tag:hover {
  background: #e0e0e0;
}

.tag.active {
  background: #4caf50;
  color: white;
  font-weight: 500;
}

.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-messages {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.message-bubble {
  max-width: 75%;
  display: flex;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-bubble.ai {
  align-self: flex-start;
  flex-direction: row;
  gap: 12px;
}

.message-bubble.user {
  align-self: flex-end;
  flex-direction: row-reverse;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4caf50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-content .avatar {
  background: #666;
}

.message-container {
  flex: 1;
}

.user-content {
  background: #4caf50;
  color: white;
  border-radius: 12px;
  padding: 12px 16px;
  max-width: 600px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.ai-content .message-container {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f2f5 url('loading-spinner.svg') no-repeat center;  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.generated-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.generated-image:hover {
  transform: scale(1.02);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.download-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: all 0.3s ease;
}

.download-btn:hover {
  transform: scale(1.1);
  background: white;
}

.typing-indicator {
  display: flex;
  gap: 8px;
  padding: 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #ddd;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.input-area {
  background: white;
  border-top: 1px solid #e3e8f1;
  padding: 16px 24px;
  position: sticky;
  bottom: 0;
}

.input-button-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-field {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e3e8f1;
  border-radius: 12px;
  resize: none;
  font-size: 14px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  min-height: 48px;
  max-height: 150px;
}

.input-field:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76,175,80,0.1);
}

.send-button {
  padding: 12px 24px;
  height: 48px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.send-button:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
}

.send-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .main-container {
    grid-template-columns: 1fr;
  }
  
  .prompt-sidebar {
    display: none;
  }
  
  .message-bubble {
    max-width: 90%;
  }
  
  .input-area {
    padding: 12px;
  }
}
</style>
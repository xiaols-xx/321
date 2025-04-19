<template>
  <div class="main-container">
    <!-- 左侧提示词侧边栏 -->
    <div class="prompt-sidebar">
      <div class="scroll-container">
        <!-- 建筑类型与功能分类 -->
        <div class="suggestions-category">
          <h3>建筑类型</h3>
          <div class="tags">
            <span
              v-for="type in buildingTypes"
              :key="type"
              class="tag"
              :class="{ active: selectedTags.includes(type) }"
              @click="handleTagClick(type)"
            >
              {{ type }}
            </span>
          </div>
        </div>

        <div class="suggestions-category">
          <h3>功能空间</h3>
          <div class="tags">
            <span
              v-for="space in functionalSpaces"
              :key="space"
              class="tag"
              :class="{ active: selectedTags.includes(space) }"
              @click="handleTagClick(space)"
            >
              {{ space }}
            </span>
          </div>
        </div>

        <!-- 建筑风格与设计语言 -->
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
          <h3>形态特征</h3>
          <div class="tags">
            <span
              v-for="feature in morphologicalFeatures"
              :key="feature"
              class="tag"
              :class="{ active: selectedTags.includes(feature) }"
              @click="handleTagClick(feature)"
            >
              {{ feature }}
            </span>
          </div>
        </div>

        <!-- 材料与构造技术 -->
        <div class="suggestions-category">
          <h3>建筑材料</h3>
          <div class="tags">
            <span
              v-for="material in buildingMaterials"
              :key="material"
              class="tag"
              :class="{ active: selectedTags.includes(material) }"
              @click="handleTagClick(material)"
            >
              {{ material }}
            </span>
          </div>
        </div>
        <div class="suggestions-category">
          <h3>构造工艺</h3>
          <div class="tags">
            <span
              v-for="technique in constructionTechniques"
              :key="technique"
              class="tag"
              :class="{ active: selectedTags.includes(technique) }"
              @click="handleTagClick(technique)"
            >
              {{ technique }}
            </span>
          </div>
        </div>

        <!-- 环境与技术参数 -->
        <div class="suggestions-category">
          <h3>环境性能</h3>
          <div class="tags">
            <span
              v-for="performance in environmentalPerformances"
              :key="performance"
              class="tag"
              :class="{ active: selectedTags.includes(performance) }"
              @click="handleTagClick(performance)"
            >
              {{ performance }}
            </span>
          </div>
        </div>
        <div class="suggestions-category">
          <h3>视觉与尺度</h3>
          <div class="tags">
            <span
              v-for="scale in visualScales"
              :key="scale"
              class="tag"
              :class="{ active: selectedTags.includes(scale) }"
              @click="handleTagClick(scale)"
            >
              {{ scale }}
            </span>
          </div>
        </div>

        <!-- 可持续与智能建筑 -->
        <div class="suggestions-category">
          <h3>绿色建筑</h3>
          <div class="tags">
            <span
              v-for="green in greenBuildings"
              :key="green"
              class="tag"
              :class="{ active: selectedTags.includes(green) }"
              @click="handleTagClick(green)"
            >
              {{ green }}
            </span>
          </div>
        </div>
        <div class="suggestions-category">
          <h3>智能建筑</h3>
          <div class="tags">
            <span
              v-for="smart in smartBuildings"
              :key="smart"
              class="tag"
              :class="{ active: selectedTags.includes(smart) }"
              @click="handleTagClick(smart)"
            >
              {{ smart }}
            </span>
          </div>
        </div>

        <!-- 装饰与艺术元素 -->
        <div class="suggestions-category">
          <h3>装饰细节</h3>
          <div class="tags">
            <span
              v-for="detail in decorationDetails"
              :key="detail"
              class="tag"
              :class="{ active: selectedTags.includes(detail) }"
              @click="handleTagClick(detail)"
            >
              {{ detail }}
            </span>
          </div>
        </div>
        <div class="suggestions-category">
          <h3>色彩与质感</h3>
          <div class="tags">
            <span
              v-for="texture in colorTextures"
              :key="texture"
              class="tag"
              :class="{ active: selectedTags.includes(texture) }"
              @click="handleTagClick(texture)"
            >
              {{ texture }}
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
        <div class="suggestions-category">
          <h3>空间比例</h3>
          <div class="tags">
            <span
              v-for="proportion in spaceProportions"
              :key="proportion"
              class="tag"
              :class="{ active: selectedTags.includes(proportion) }"
              @click="handleTagClick(proportion)"
            >
              {{ proportion }}
            </span>
          </div>
        </div>
        <div class="suggestions-category">
          <h3>材质肌理</h3>
          <div class="tags">
            <span
              v-for="texture in materialTextures"
              :key="texture"
              class="tag"
              :class="{ active: selectedTags.includes(texture) }"
              @click="handleTagClick(texture)"
            >
              {{ texture }}
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

// 建筑类型与功能分类
const buildingTypes = [
  '住宅', '商业', '办公', '学校', '医院', '博物馆', '图书馆', '美术馆', '剧院', '体育场馆',
  '宗教建筑', '公共设施', '交通建筑', '仓储建筑', '工业建筑', '农业建筑', '生态建筑', '绿色建筑'
];
const functionalSpaces = [
  '客厅', '卧室', '厨房', '卫生间', '书房', '儿童房', '健身房', '餐厅', '阳台', '露台',
  '娱乐室', '学习室', '办公室', '会议室', '接待室', '休息室', '展览室', '表演空间',
  '休息室', '多功能空间', '停车场', '商业空间', '医疗空间', '教育空间'
];

// 建筑风格与设计语言
const architecturalStyles = [
  '古典主义（希腊/罗马式）', '哥特式', '巴洛克', '洛可可', '中式（唐风/宋代/新中式）',
  '日式（侘寂/枯山水）', '伊斯兰风格（穹顶/尖拱）', '现代主义（柯布西耶式）', '国际风格',
  '粗野主义', '高技派（罗杰斯/皮亚诺）', '解构主义（盖里/哈迪德）', '参数化主义（扎哈流线/网格表皮）',
  '地中海风格（拱券/陶瓦）', '北欧风格（极简/木质肌理）', '热带风格（百叶遮阳/通风腔体）',
  '乡土建筑（夯土/干栏式/窑洞）'
];
const morphologicalFeatures = [
  '穿插体块', '悬挑结构', '退台渐变', '双曲面表皮', '折叠立面', '立方体阵列',
  '落地窗', '老虎窗', '梭形窗', '花格窗', '竖向遮阳百叶', '幕墙转角弧度',
  '坡屋顶（单坡/双坡/四坡）', '平屋顶', '曲面屋顶', '穹顶', '悬索结构屋顶'
];

// 材料与构造技术
const buildingMaterials = [
  '钢筋混凝土', '钢结构（H型钢/网架/桁架）', '木结构（胶合木/榫卯）', '砌体（青砖/陶土砖/加气混凝土砌块）',
  '玻璃（Low - E玻璃/夹胶玻璃/渐变玻璃）', '金属（铝板/钛锌板/锈蚀钢板）', '石材（花岗岩/大理石/洞石）',
  '复合材料（GRC/ETFE膜/陶土板）', '马赛克', '水磨石', '木饰面', '岩板', '艺术涂料', '金属网帘', '透光混凝土'
];
const constructionTechniques = [
  '框架结构', '剪力墙结构', '筒体结构', '混合结构', '空间结构（网架/悬索/膜结构）',
  '玻璃肋连接', '钢结构节点（铸钢节点/螺栓球节点）', '幕墙转接件', '预制构件接缝',
  'BIM正向设计', '3D打印建筑', '装配式建造（PC构件/模块化吊装）', '清水混凝土一次浇筑'
];

// 环境与技术参数
const environmentalPerformances = [
  '被动式设计（自然通风/采光/隔热）', '遮阳系统（水平/垂直/综合遮阳）', '雨水回收', '地热利用',
  '容积率', '建筑密度', '绿化率', '日照间距', '窗墙比', '隔声量（dB）', '保温系数（K值）',
  '漫反射光', '直射光', '眩光控制', '导光管', '光井', '反光板'
];
const visualScales = [
  '黄金分割', '模数化（柯布西耶模度）', '高宽比', '层高压（3m/4.5m/挑高6m）',
  '一点透视', '两点透视', '鱼眼视角', '鸟瞰视角', '人视角度（1.5m高度）',
  '石材拼缝（5mm/10mm）', '金属板分缝', '幕墙胶缝处理'
];

// 可持续与智能建筑
const greenBuildings = [
  'LEED认证', '中国三星级绿色建筑', '光伏建筑一体化（BIPV）', '绿植幕墙', '地源热泵',
  '气密性建筑', '热桥阻断', '可再生能源利用', '雨水花园', '光导纤维照明',
  '再生混凝土', '回收钢材', '竹材（速生/可持续采伐）', '低碳石膏板'
];
const smartBuildings = [
  '楼宇自动化（BA系统）', '智能照明（动态色温/人体感应）', '安防系统（人脸识别/红外监测）',
  '触控界面', 'AR看房', '智能遮阳（光敏自动调节）', '能耗监测可视化'
];

// 装饰与艺术元素
const decorationDetails = [
  '柱式（多立克/爱奥尼/科林斯）', '浮雕', '拱券', '山花', '藻井', '斗拱',
  '艺术装置（雕塑/光影艺术）', '穿孔金属板', '渐变玻璃', '旋转楼梯', '悬浮吊顶',
  '中式花窗', '阿拉伯花纹', '日式格子门', '非洲图腾浮雕'
];
const colorTextures = [
  '哑光金属', '镜面玻璃', '粗粝混凝土', '木纹肌理', '石材荔枝面', '金属拉丝',
  '莫兰迪色系', '高饱和度撞色', '中性色调（黑白灰/原木色）', '地域色彩（地中海蓝/西班牙红）'
];

const architecturalElements = [
  '玻璃幕墙', '中庭', '采光顶', '木格栅', '弧形屋顶', '露台',
  '立柱', '庭院', '天窗', '水景'
];
const spaceProportions = [
  '黄金比例', '1:1正方形比例', '1:√2比例', '竖向长矩形比例', '横向长矩形比例'
];

const materialTextures = [
  '混凝土粗糙肌理', '木质温润纹理', '石材天然纹理', '金属光滑质感', '玻璃透明质感'
];

const architects = [
  '赖特', '密斯·凡·德罗', '柯布西耶', '扎哈·哈迪德', '安藤忠雄', '贝聿铭',
  '雷姆·库哈斯', '弗兰克·盖里', '隈研吾', '王澍'
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
  const username = store.user?.username || 'user';
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
      type: 'user',
      content: 'input',
      created_at: new Date().toISOString()
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
      messages.value = (response.data.history || []).sort((a,b) => new Date(a.created_at) - new Date(a.created_at));
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
    created_at: new Date().toISOString(),
    loading: true
  });
  messages.value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
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
    messages.value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
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
  margin-right: auto;
}

.message-bubble.user {
  align-self: flex-end;
  flex-direction: row-reverse;
  gap: 12px;
  margin-right: auto;
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
  background: #f0f2f5 url('loading-spinner.svg') no-repeat center;
  min-height: 200px;
  display: flex;
  align-items: center;
  width: auto;
  border-radius: 8px;
  object-fit: contain;
  justify-content: center;
  max-height: 300px;
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
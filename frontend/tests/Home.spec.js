import { mount } from '@vue/test-utils'
import Home from '../Home.vue'
import { useUserStore } from '../../store/authStore'
import { nextTick } from 'vue'
import axios from 'axios'

// 模拟axios和Vue Router
jest.mock('axios')
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

describe('Home组件', () => {
  let wrapper
  const mockUser = {
    id: 1,
    username: 'testuser',
    token: 'mock-token'
  }

  beforeEach(() => {
    // 初始化用户状态
    const store = useUserStore()
    store.setUser(mockUser)
    store.setToken(mockUser.token)
    
    // 挂载组件
    wrapper = mount(Home, {
      global: {
        mocks: {
          $router: {
            push: jest.fn()
          }
        }
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('应正确渲染初始状态', () => {
    // 验证基础元素
    expect(wrapper.find('.input-field').exists()).toBe(true)
    expect(wrapper.find('.send-button').text()).toContain('发送')
    expect(wrapper.findAll('.message-bubble').length).toBe(0)
  })

  it('应正确处理图片生成流程', async () => {
    // 模拟API响应
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        image_url: 'https://example.com/image.jpg'
      }
    })

    // 模拟用户输入
    await wrapper.find('textarea').setValue('现代风格建筑')
    await wrapper.find('form').trigger('submit')

    // 验证加载状态
    expect(wrapper.vm.isGenerating).toBe(true)
    expect(wrapper.find('.send-button').text()).toContain('生成中...')

    // 等待异步操作完成
    await nextTick()

    // 验证消息列表更新
    const messages = wrapper.findAll('.message-bubble')
    expect(messages.length).toBe(2) // 用户消息 + AI占位消息
    
    // 验证API调用参数
    expect(axios.post).toHaveBeenCalledWith(
      '/api/generate',
      { prompt: '现代风格建筑' },
      {
        headers: {
          Authorization: `Bearer ${mockUser.token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    // 验证最终状态更新
    await wrapper.vm.$nextTick()
    const aiMessage = wrapper.findAll('.message-bubble')[1]
    expect(aiMessage.find('img').attributes('src')).toBe('https://example.com/image.jpg')
  })

  it('应处理生成失败场景', async () => {
    // 模拟API失败
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: '生成失败' }
      }
    })

    await wrapper.find('textarea').setValue('无效提示词')
    await wrapper.find('form').trigger('submit')

    // 等待错误处理
    await nextTick()
    await wrapper.vm.$nextTick()

    // 验证错误状态
    const aiMessages = wrapper.findAll('.message-bubble.ai')
    expect(aiMessages[aiMessages.length - 1].text()).toContain('抱歉，生成失败')
  })

  it('应正确处理标签点击', async () => {
    const tag = wrapper.findAll('.tag')[0]
    await tag.trigger('click')
    
    // 验证输入框更新
    expect(wrapper.vm.userInput).toContain(tag.text())
    expect(tag.classes()).toContain('active')
  })

  it('应阻止空提交', async () => {
    await wrapper.find('form').trigger('submit')
    expect(axios.post).not.toHaveBeenCalled()
  })
})
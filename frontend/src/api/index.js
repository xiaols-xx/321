import request from '../utils/request'

// 用户相关
export const login = (data) => {
  return request.post('/api/auth/login', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const register = (data) => {
  return request.post('/api/auth/register', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 图片生成相关
export const generateImage = (description) => {
  return request.post('/api/generate', { description }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export default {
  login,
  register,
  generateImage
}
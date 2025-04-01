import { mount } from '@vue/test-utils';
import Login from '../Login.vue';
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '../src/store/authStore';
import { createPinia, setActivePinia } from 'pinia';

jest.mock('axios');

describe('Login.vue', () => {
  let wrapper;
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    wrapper = mount(Login, {
      global: {
        plugins: [pinia]
      }
    });
  });

  it('should submit form and call handleLogin method', async () => {
    const usernameInput = wrapper.find('input[placeholder="用户名"]');
    const passwordInput = wrapper.find('input[placeholder="密码"]');
    const submitButton = wrapper.find('button[type="submit"]');

    await usernameInput.setValue('testuser');
    await passwordInput.setValue('testpassword');

    axios.post.mockResolvedValue({ data: { token: 'testtoken', username: 'testuser' } });

    await submitButton.trigger('submit');

    expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
      username: 'testuser',
      password: 'testpassword'
    });
  });
});
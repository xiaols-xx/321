import { mount } from '@vue/test-utils';
import Register from '../Register.vue';
import { ref } from 'vue';
import axios from 'axios';

jest.mock('axios');

describe('Register.vue', () => {
  it('should submit form and call register method', async () => {
    const wrapper = mount(Register);
    const usernameInput = wrapper.find('input[placeholder="用户名"]');
    const passwordInput = wrapper.find('input[placeholder="密码"]');
    const submitButton = wrapper.find('button[type="submit"]');

    await usernameInput.setValue('testuser');
    await passwordInput.setValue('testpassword');

    axios.post.mockResolvedValue({ data: {} });

    await submitButton.trigger('submit');

    expect(axios.post).toHaveBeenCalledWith('/api/auth/register', {
      username: 'testuser',
      password: 'testpassword'
    });
  });
});
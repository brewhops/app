import { shallowMount } from '@vue/test-utils'
import login from '@/views/login.vue'

describe('login.vue', () => {
  it('renders login page', () => {
    const wrapper = shallowMount(login);
    expect(wrapper).toMatchSnapshot();
  })
})

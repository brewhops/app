import { shallowMount } from '@vue/test-utils'
import Loader from '@/components/loader.vue'

describe('loader.vue', () => {
  it('renders loader component', () => {
    const wrapper = shallowMount(Loader);
    expect(wrapper).toMatchSnapshot();
  })
})

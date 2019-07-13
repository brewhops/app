import { shallowMount } from '@vue/test-utils'
import Loader from '@/components/loader.vue'

describe('loader.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = shallowMount(Loader);
    expect(wrapper).toMatchSnapshot();
  })
})

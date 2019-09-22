import Loader from "@/components/loader.vue";
import { shallowMount } from "@vue/test-utils";

describe("loader.vue", () => {
  it("renders loader component", () => {
    const wrapper = shallowMount(Loader);
    expect(wrapper).toMatchSnapshot();
  });
});

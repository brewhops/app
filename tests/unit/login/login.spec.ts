import login from "@/views/login.vue";
import { shallowMount } from "@vue/test-utils";

describe("login.vue", () => {
  it("renders login page", () => {
    const wrapper = shallowMount(login);
    expect(wrapper).toMatchSnapshot();
  });
});

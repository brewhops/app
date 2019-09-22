import RecipeComponent from "@/components/tank-info/recipe.vue";
import { Recipe } from "@/types/index";
import { shallowMount, Wrapper } from "@vue/test-utils";

describe("recipe.vue", () => {
  let propsData: any;

  beforeAll(() => {
    const recipe: Recipe = {
      name: "Spicy Hops Beer",
      airplane_code: "SHB",
      yeast: 2,
      instructions: [{
        ingredient: "Spicy Hops",
        ratio: ".5",
      }],
    };

    propsData = { recipe, volume: 10 };
  });

  it("renders recipe component", () => {
    const wrapper = shallowMount(RecipeComponent, { propsData });
    expect(wrapper).toMatchSnapshot();
  });

  it("displays correctly computed weight", () => {
    const wrapper = shallowMount(RecipeComponent, { propsData });
    expect(wrapper.find("tbody :nth-child(3)").text()).toEqual("5");
  });

});

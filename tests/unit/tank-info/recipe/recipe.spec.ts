import { shallowMount, Wrapper } from '@vue/test-utils'
import RecipeComponent from '@/components/tank-info/recipe.vue'
import { Recipe } from '@/types/index'

describe('recipe.vue', () => {
  let propsData: any;
  let wrapper: Wrapper<RecipeComponent>;

  beforeAll(() => {
    const recipe: Recipe = {
      name: 'Spicy Hops Beer',
      airplane_code: 'SHB',
      yeast: 2,
      instructions: [{
        ingredient: 'Spicy Hops',
        ratio: '.5'
      }] 
    }

    propsData = { recipe, volume: 10 };
  })

  beforeEach(() => {
    wrapper = shallowMount(RecipeComponent, { propsData });
  })

  it('renders recipe component', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('displays correctly computed weight', () => {
    expect(wrapper.find('tbody :nth-child(3)').text()).toEqual('5');
  });

})
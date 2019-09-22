<template>
  <div class="element">
    <h2>Create New Brand</h2>
    <div id="full">
      <input v-model.lazy="recipe_name" placeholder="Brand Name" />
      <span>{{ feedback.brandID }}</span>
      <input v-model.lazy="airplane_code" placeholder="Airport Code" />
      <input v-model="yeast" placeholder="Yeast" />
      <!-- TODO: Validate Yeast?? maybe-->
      <span>{{ feedback.yeast }}</span>
    </div>
    <div id="half">
      <div class="inline" v-for="(instruction, index) in instructions" v-bind:key="index">
        <input id="halfsizeleft" v-model="instruction.ingredient" placeholder="Dry Hop/Adjunct" />
        <input id="halfsizeright" v-model="instruction.ratio" placeholder="Rate" />
      </div>
    </div>
    <button type="button" v-on:click="addInstrction()">Add Another Row</button>
    <button v-on:click="recipe_submit">Submit</button>
    <span>{{ feedback.server.brand }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import { Tank, Ingredient, BrewhopsCookie } from 'src/types/index';

interface ICreateBrandState {
  brandID: string;
  airplane_code: string;
  instructions: Ingredient[];
  recipe_name: string;
  yeast: string;
  feedback: {
    brandID: string;
    server: {
      brand: string;
    };
  };
}

// tslint:disable: no-console

export default Vue.extend({
  name: 'create-brand',
  data(): ICreateBrandState {
    return {
      brandID: '',
      airplane_code: '',
      instructions: [],
      recipe_name: '',
      yeast: '',
      feedback: {
        brandID: '',
        server: {
          brand: ''
        }
      }
    };
  },
  mounted() {
    for (let i = 0; i < 4; i++) {
      this.addInstruction();
    }
  },
  watch: {
    brandID() {
      const brandID = this.brandID;
      if (brandID && brandID.match('^[0-9A-z]+$')) {
        this.feedback.brandID = '';
      } else {
        this.feedback.brandID = 'Brand ID can only be numbers and dashes';
      }
    }
  },
  methods: {
    addInstruction() {
      this.instructions.push({
        ingredient: '',
        ratio: ''
      });
    },
    async recipe_submit() {
      // Now only add to recipe the values that aren't empty or null
      const instructions = this.instructions.filter(e => e.ingredient !== '' && e.ratio !== '');

      const recipe = {
        airplane_code: this.airplane_code,
        instructions: JSON.stringify(instructions),
        yeast: this.yeast,
        name: this.recipe_name
      };

      try {
        const response = await this.$http.post(`${process.env.VUE_APP_API}/recipes/`, recipe);
        if (response.ok) {
          this.$emit('update');
          this.feedback.server.brand = 'Created a new brand.';
          setTimeout(async () => (this.feedback.server.brand = ``), 5000);
        }
      } catch (err) {
        console.error(err);
        this.feedback.server.brand = 'Failed to create new brand.';
      }
    }
  }
});
</script>

<style lang="stylus" scoped>




#full{
  @media screen and (max-width:555px ) {
    width 90%
  }
}
#half {
  @media screen and (max-width:555px ) {
    width 90%
  }
}

#halfsizeleft
  width 50%
  padding-right 7px

#halfsizeright
  width 50%
  padding-left 7px
</style>

<template>
  <div v-if="!brand" class="element">
    <h2>Edit Brand</h2>
    <select class="dropdown" v-on:change="populateBrand" v-model="brandID">
      <option disabled value="">Select Brand</option>
      <option v-for="(brand, idx) in brands" v-bind:key="idx" :value="brand.id">{{
        brand.name
      }}</option>
    </select>
  </div>
  <div v-else class="element">
    <h2>Edit {{ recipe_name }}</h2>
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
    <div>
      <button type="button" v-on:click="addInstruction()">Add Another Row</button>
      <button v-on:click="recipe_submit">Submit</button>
      <button v-on:click="clearBrand">Select a Brand</button>
    </div>
    <span>{{ feedback.server.brand }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import { Tank, Recipe, Ingredient, BrewhopsCookie } from '@/types/index';

interface IEditBrandState {
  brand?: Recipe;
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
  name: 'edit-brand',
  props: ['brands'],
  data(): IEditBrandState {
    return {
      brand: undefined,
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

      const brand = {
        id: parseInt(this.brandID),
        yeast: parseInt(this.yeast),
        airplane_code: this.airplane_code,
        instructions: JSON.stringify(instructions),
        name: this.recipe_name,
        update_user: Cookie.getJSON('loggedIn').id
      };

      const headers = {
        Authorization: `Bearer ${Cookie.getJSON('loggedIn').token}`
      };

      try {
        const response = await this.$http.patch(
          `${process.env.VUE_APP_API}/recipes/id/${brand.id}`,
          brand,
          { headers }
        );
        if (response.ok) {
          this.$emit('update');
          this.feedback.server.brand = `Edited brand ${this.recipe_name}.`;
          setTimeout(async () => {
            this.feedback.server.brand = ``;
            this.clearBrand();
          }, 5000);
        }
      } catch (err) {
        console.error(err);
        this.feedback.server.brand = `Failed to edit brand ${this.recipe_name}.`;
      }
    },
    populateBrand() {
      if (this.brandID) {
        this.brand = this.brands.filter(
          (brand: Recipe) => brand.id === parseInt(this.brandID, 10)
        )[0];
        if (this.brand) {
          const { id, name, airplane_code, yeast, instructions } = this.brand;
          console.log(this.brand);
          this.recipe_name = name;
          this.airplane_code = airplane_code;
          this.yeast = yeast.toString(10);
          this.instructions = instructions;
        }
      }
    },
    clearBrand() {
      this.brand = undefined;
      this.brandID = '';
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

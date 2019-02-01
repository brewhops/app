<template>
  <div class="element">
    <h2>Create New Brand</h2>
    <input v-model.lazy="recipe_name" placeholder="Brand Name" />
    <span>{{ feedback.brandID }}</span>
    <input v-model.lazy="airplane_code" placeholder="Airport Code" />
    <input v-model="yeast" placeholder="Yeast" />
    <!-- TODO: Validate Yeast?? maybe-->
    <span>{{ feedback.yeast }}</span>
    <div class="inline" v-for="x in hopNumbers" v-bind:key="x">
      <input v-model="dryHopAdjunct[x - 1]" placeholder="Dry Hop/Adjunct" />
      <input v-model="rate[x - 1]" placeholder="Rate" />
    </div>
    <button type="button" v-on:click="hopNumbers += 1">Add Another Row</button>
    <button v-on:click="recipe_submit">Submit</button>
    <span>{{ feedback.server.brand }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Cookie from 'js-cookie';
import { Tank, BrewhopsCookie } from '../../types';

interface ICreateBatchState {
  brandID: string;
  airplane_code: string;
  dryHopAdjunct: string[];
  rate: string[];
  recipe_name: string;
  hopNumbers: number;
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
  name: 'create-tank',
  props: ['tanks', 'statuses'],
  data(): ICreateBatchState {
    return {
      brandID: '',
      airplane_code: '',
      dryHopAdjunct: [],
      rate: [],
      recipe_name: '',
      hopNumbers: 4,
      yeast: '',
      feedback: {
        brandID: '',
        server: {
          brand: ''
        }
      }
    };
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
    async recipe_submit() {
      // Now only add to recipe the values that aren't empty or null
      const instructions = {};
      if (this.dryHopAdjunct) {
        for (const x in this.dryHopAdjunct) {
          if (!(this.dryHopAdjunct[x] === '' || this.dryHopAdjunct === null)) {
            instructions[this.dryHopAdjunct[x]] = this.rate[x];
          }
        }
      }

      const recipe = {
        airplane_code: this.airplane_code,
        instructions: JSON.stringify(instructions),
        name: this.recipe_name
      };

      const headers = {
        Authorization: `Bearer ${Cookie.getJSON('loggedIn').token}`
      };

      try {
        const response = await this.$http.post(`${process.env.API}/recipes`, recipe, { headers });
        if (response.ok) {
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

<style lang="stylus" scoped></style>

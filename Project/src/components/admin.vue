<template>
    <div>
      <div class="header">
         <router-link to="/">logout</router-link>
         <h2>Ninkasi Admin</h2>
     </div>
     <div id="content">
         <div id="misc">
             <h2>Create New Fields</h2>
             <input type="text" placeholder="Tank Number">
             <input type="text" placeholder="Action Needed">
             <button>Submit</button>
         </div>
         <div id="user">
             <h2>Create New User</h2>
             <input v-model.lazy="first_name" placeholder="First Name">
             <span>{{ feedback.first_name }}</span>
             <input v-model.lazy="last_name" placeholder="Last Name">
             <span>{{ feedback.last_name }}</span>
             <input v-model.lazy="username" placeholder="Username">
             <span>{{ feedback.username }}</span>
             <input v-model.lazy="password" placeholder="Password">
             <span>{{ feedback.password }}</span>
             <input v-model.lazy="passwordcheck" placeholder="Re-enter password">
             <span>{{ feedback.passwordcheck }}</span>

             <button v-on:click="login_submit">Submit</button>

         </div>
         <div id="brand">
             <h2>Create New Brand</h2>
             <input v-model.lazy="brandID" placeholder="Brand ID">
             <span>{{ feedback.brandID }}</span>
             <input v-model="yeast" placeholder="Yeast"> <!-- TODO: Validate Yeast?? maybe-->
             <span>{{ feedback.yeast }}</span>
             <div class="inline">
               <input v-model="dryhopadjunct[0]" placeholder="Dry Hop/Adjunct">
               <span>{{ feedback.first_name }}</span>
               <input v-model="rate[0]" placeholder="Rate">
               <span>{{ feedback.last_name }}</span>
             </div>
             <div class="inline">
               <input v-model="dryhopadjunct[1]" placeholder="Dry Hop/Adjunct">
               <span>{{ feedback.first_name }}</span>
               <input v-model="rate[1]" placeholder="Rate">
               <span>{{ feedback.last_name }}</span>
             </div>
             <div class="inline">
               <input v-model="dryhopadjunct[2]" placeholder="Dry Hop/Adjunct">
               <span>{{ feedback.first_name }}</span>
               <input v-model="rate[2]" placeholder="Rate">
               <span>{{ feedback.last_name }}</span>
             </div>
             <div class="inline">
               <input v-model="dryhopadjunct[3]" placeholder="Dry Hop/Adjunct">
               <span>{{ feedback.first_name }}</span>
               <input v-model="rate[3]" placeholder="Rate">
               <span>{{ feedback.last_name }}</span>
             </div>
             <div class="inline">
               <input v-model="dryhopadjunct[4]" placeholder="Dry Hop/Adjunct">
               <span>{{ feedback.first_name }}</span>
               <input v-model="rate[4]" placeholder="Rate">
               <span>{{ feedback.last_name }}</span>
             </div>
             <div class="inline">
               <input v-model="dryhopadjunct[5]" placeholder="Dry Hop/Adjunct">
               <span>{{ feedback.first_name }}</span>
               <input v-model="rate[5]" placeholder="Rate">
               <span>{{ feedback.last_name }}</span>
             </div>
             <div class="inline">
               <input v-model="dryhopadjunct[6]" placeholder="Dry Hop/Adjunct">
               <span>{{ feedback.first_name }}</span>
               <input v-model="rate[6]" placeholder="Rate">
               <span>{{ feedback.last_name }}</span>
             </div>
             <div class="inline">
               <input v-model="dryhopadjunct[7]" placeholder="Dry Hop/Adjunct">
               <span>{{ feedback.first_name }}</span>
               <input v-model="rate[7]" placeholder="Rate">
               <span>{{ feedback.last_name }}</span>
             </div>
             <button v-on:click="recipe_submit">Submit</button>
             {{ dryhopadjunct }}
             {{ rate }}
         </div>
     </div>
    </div>
</template>

<script>
export default {
  name: 'admin',
  data() {
    return {
      database: {},

      first_name: '',
      last_name: '',
      username: '',
      password: '',

      dryhopadjunct: [],
      rate: [],
      brandID: '',
      yeast: '',
      passwordcheck: '',

      feedback: {
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        passwordcheck: '',

        dryhopadjunct: '',
        brandID: '',
        yeast: '',
      },
      msg: '',
    };
  },
  watch: {
    first_name: function() {
      // shorten our username variable for readability
      const first_name = this.first_name;

      if (first_name.match('^[A-z\-]+$')) {
        this.feedback.first_name = ''
      } else {
        this.feedback.first_name = 'First name can only be digits and letters'
      }
    },
    last_name: function() {
      // shorten our username variable for readability
      const last_name = this.last_name;

      if (last_name.match('^[A-z\-\s]+$')) {
        this.feedback.last_name = ''
      } else {
        this.feedback.last_name = 'First name can only be letters, spaces, and hyphens'
      }
    },
    username: function() {
      const username = this.username;

      var x;
      for(x in this.database){
        if(x.username === username)
          this.feedback.username = 'Username taken'
      }

      if (username.length === 0) {
        this.feedback.username = 'Username required'
      } else if (username.length < 3 || username.length > 20) {
        this.feedback.username = 'Username must be between 3 and 20 characters'
      } else if (username.match('^[0-9A-z]+$')) {
        this.feedback.username = ''
      } else {
        this.feedback.username = 'Username must only be digits and letters'
      }
    },
    password: function() {
      const password = this.password

      if (password.length === 0) {
        this.feedback.password = 'Password required'
      } else if (password.length < 6 || password.length > 25) {
        this.feedback.password = 'Password must be between 6 and 25 characters'
      } else if (password.match('^[0-9A-z@#$%*^!\-=&]+$')) {
        this.feedback.password = ''
      } else {
        this.feedback.password = 'Password must only be digits and letters'
      }
    },
    passwordcheck: function() {
      if(this.passwordcheck === this.password)
        this.feedback.passwordcheck = ''
      else {
        this.feebdback.passwordcheck = 'Passwords must match'
      }
    },
    brandID: function(){
      var brandID = this.brandID;
      if(brandID.match('^[0-9A-z]+$')){
        this.feedback.brandID = ''
      }
      else {
        this.feedback.brandID = 'Brand ID can only be letters and numbers I think???' //TODO: CHECK IF THIS IS A TRUE STATAMENT
      }
    }
  },
  beforeMount() {
    //get users from heroku
    this.$http.get('https://ninkasi-server.herokuapp.com/employees').then(response => {
      // get body data
      this.database = response.body;
    }, response => {
      this.debugging = 'Debugging Flag: Response error, cant access employees page';
      console.log(this.database);
    });
  },
  methods: {
      login_submit: function () {
        var flag = true;
        var x;
        for(x in this.database){
          if(this.database[x].username === this.username)
            this.feedback.username = 'Username taken'
            flag = false;
        }
        // if( !(this.passwordcheck === this.password)){ //TODO: Figure out why passwordcheck variable is "undefined" constantly
        //   flag = false;
        // }

        //if all checks pass
        if(flag == true){
          var formData = new FormData();
            formData.append('first_name', this.first_name);
            formData.append('last_name', this.last_name);
            formData.append('username', this.username);
            formData.append('password', this.password);
            this.$http.post('https://ninkasi-server.herokuapp.com/employees', formData) //TODO: CHECK FORM DATA SUBMISSION, it worked once!
            console.log(formData);
        }
        else {
          console.log("ERROR: NEW USER ENTRY NEVER HAPPENING!")
        }
      },
      recipe_submit: function(){
        var formData = new FormData();
        //Now only add to recipe the values that aren't empty or null
        var recipe = [];
        var rates = [];
        var x;
        for(x in this.dryhopadjunct){
          if(this.dryhopadjunct[x] != '' || this.dryhopadjunct[x] != null){
            recipe.push(this.dryhopadjunct[x])
            rates.push(this.rate[x])
          }
        }
        //append recipe, submit to database
        var stringrecipe = "";
        var stringrates = "";
        for(x in recipe){
          stringrecipe += recipe[x];
          stringrecipe =  stringrecipe + " rate: " + rates[x];
        }
        formData.append('instructions', stringrecipe);
        formData.append('recipe_name', this.brandID);
        console.log(formData);
        this.$http.post('https://ninkasi-server.herokuapp.com/recipes', formData)
      }

    }
};
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

#content
  display grid
  grid-template-rows 1fr 1fr
  grid-template-columns 1fr 1fr
  grid-template-areas "misc brand" "user brand"
  grid-gap 3vw
  width 80%
  margin auto
  align-items flex-start
  +less-than(tablet)
    width 98%
    grid-template-rows auto
    grid-template-columns auto
    grid-template-areas "brand" "misc" "user"


#misc, #user, #brand
  padding 20px
  text-align center

#misc
  grid-area misc

#user
  grid-area user

#brand
  grid-area brand
  .inline
    input
      width 49%

</style>

<template>
    <div>
      <div class="header">
         <a v-on:click="logout">Logout</a>
         <h2>Ninkasi Admin</h2>

     </div>
     <div id="content">
         <div class="element">
             <h2>Create New Tank</h2>
             <input v-model.lazy="tank_id" placeholder="New Tank Number">
             <span>{{ feedback.tank_id }}</span>

             <select v-model="status" class="dropdown">
               <option disabled value="">Status on Tank</option>
               <option v-for="tankStatus in tankStatuses" :value="tankStatus">{{tankStatus}}</option>
             </select>

            <div class="checkbox">
              <input type="checkbox" id="checkbox" v-model="in_use">
              <p>Tank is in use</p>
            </div>

             <button v-on:click="tank_submit">Submit</button>
        </div>
        <div class="element">
             <h2>Update Tank Status {{ tank_id }}</h2>
             <select v-model="tank_id" class="dropdown">
               <option disabled value="">Tank Number</option>
               <option v-for="tank in tanks" :value="tank.id">{{tank.tank_id}}</option>
             </select>

             <select v-model="status" class="dropdown">
               <option disabled value="">Status on Tank</option>
               <option v-for="tankStatus in tankStatuses" :value="tankStatus">{{tankStatus}}</option>
             </select>

             <button v-on:click="tank_update">Submit</button>
         </div>
         <div class="element">
             <h2>Create New User</h2>
             <input v-model.lazy="first_name" placeholder="First Name">
             <span>{{ feedback.first_name }}</span>
             <input v-model.lazy="last_name" placeholder="Last Name">
             <span>{{ feedback.last_name }}</span>
             <input v-model.lazy="username" placeholder="Username">
             <span>{{ feedback.username }}</span>
             <input v-model.lazy="password" placeholder="Password" type="password">
             <span>{{ feedback.password }}</span>
             <input v-model.lazy="passwordcheck" placeholder="Re-enter password" type="password">
             <span>{{ feedback.passwordcheck }}</span>

             <div class="checkbox">
               <input type="checkbox" id="checkbox" v-model="admin">
               <p>User is admin</p>
             </div>

             <button v-on:click="login_submit">Submit</button>
             <span>{{ feedback.submissionResults }}</span>

         </div>
         <div class="element">
             <h2>Create New Brand</h2>
             <input v-model.lazy="recipe_name" placeholder="Brand Name">
             <span>{{ feedback.brandID }}</span>
             <input v-model.lazy="airplane_code" placeholder="Airport Code">
             <input v-model="yeast" placeholder="Yeast"> <!-- TODO: Validate Yeast?? maybe-->
             <span>{{ feedback.yeast }}</span>
             <div class="inline" v-for="x in hopNumbers">
               <input v-model="dryHopAdjunct[x-1]" placeholder="Dry Hop/Adjunct">
               <input v-model="rate[x-1]" placeholder="Rate">
             </div>
             <button type="button" v-on:click="hopNumbers+=1">Add Another Row</button>
             <button v-on:click="recipe_submit">Submit</button>
             <span>{{ feedback.submissionResults }}</span>
         </div>
     </div>
    </div>
</template>

<script>

import router from "../router/index.js"
import CryptoJS from "crypto-js"
import Cookie from "js-cookie"

export default {
  name: 'admin',
  data() {
    return {
      employees: {},
      tanks:{},

      tankStatuses: [
        "busy",
        "broken",
        "available",
        "brewing",
        "transferring",
        "completed",
      ],

      tank_id: '',
      status: '',
      in_use: false,
      admin: false,

      first_name: '',
      last_name: '',
      username: '',
      password: '',
      passwordcheck: '',

      hopNumbers: 4,
      dryHopAdjunct: [],
      rate: [],
      airplane_code: '',
      recipe_name: '',
      yeast: '',

      feedback: {
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        passwordcheck: '',
        submissionResults: '',

        dryhopadjunct: '',
        brandID: '',
        yeast: '',
      },
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

      // if the username is already in the  database,
      // give feedback and exit the function
      for(var x in this.employees) {
        if(this.employees[x].username === username) {
          this.feedback.username = 'Username taken'
          return;
        }
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
        this.feedback.passwordcheck = 'Passwords must match'
      }
    },
    brandID: function(){
      var brandID = this.brandID;
      if(brandID.match('^[0-9A-z]+$')){
        this.feedback.brandID = ''
      }
      else {
        this.feedback.brandID = 'Brand ID can only be numbers and dashes'
      }
    }
  },
  beforeMount() {
    // if the user is not logged, or they are logged in but not an admin
      // send them to the login page
      if (!Cookie.get('loggedIn') || !JSON.parse(Cookie.get('loggedIn')).admin) {
          console.log(Cookie.get('loggedIn'));
          router.push("/")
      }

      //get users from heroku
      this.$http.get(process.env.API + '/employees').then(response => {
        // get body data
        this.employees = response.body
      }, response => {
        this.debugging = 'Debugging Flag: Response error, cant access employees page'
        console.log(this.employees)
      });

      //get tank numebrs
      this.$http.get(process.env.API + '/tanks').then(response => {
        // get body data
        this.tanks = response.body
      }, response => {
        this.debugging = 'Debugging Flag: Response error, cant access tanks page'
        console.log(this.tanks)
      });

  },
  methods: {
      login_submit: function () {
        var newUser = new FormData();
        newUser.append('first_name', this.first_name)
        newUser.append('last_name', this.last_name)
        newUser.append('username', this.username)
        if(this.admin)
          newUser.append('admin', true)
        else
          newUser.append('admin', false)
        var encryptedPassword = CryptoJS.AES.encrypt(this.password, this.username).toString()
        newUser.append('password', encryptedPassword)
        this.$http.post(process.env.API + '/employees', newUser).then(response => {
          if (response.ok === true) {
            this.feedback.submissionResults = "New user succesfully created"
          }
        }, error => {
          console.log(error)
        })
      },
      recipe_submit: function(){
        var formData = new FormData()
        //Now only add to recipe the values that aren't empty or null
        let instructions = {};
        for (let x in this.dryHopAdjunct) {
          if ( !(this.dryHopAdjunct[x] === '' || this.dryHopAdjunct === null) ) {
            instructions[this.dryHopAdjunct[x]] = this.rate[x]
          }
        }
        //append recipe, submit to database
        formData.append('airplane_code', this.airplane_code)
        formData.append('instructions', JSON.stringify(instructions))
        formData.append('recipe_name', this.recipe_name)
        this.$http.post(process.env.API + '/recipes', formData).then(response => {
          if (response.ok) {
            this.feedback.submissionResults = "Created a new brand"
          }
        })
      },
      tank_submit: function(){
        var formData = new FormData();
        formData.append('tank_id', this.tank_id);
        formData.append('status', this.status);
        console.log(formData);
        if(this.in_use)
          formData.append('in_use', true);
        else
          formData.append('in_use', false);

        this.$http.post(process.env.API + '/tanks', formData)
      },
      tank_update: function (){
        var formData = new FormData();
        formData.append('status', this.status);
        var url = process.env.API + "/tanks/" + this.tank_id
        console.log(url);
        this.$http.patch(url, formData)
      },
      logout: function() {
        if (Cookie.get('loggedIn')) {
          Cookie.remove('loggedIn')
        }
        router.push("/")
      }
    }
};
</script>

<style lang="stylus" scoped>
@import '../styles/breakpoints'

#content
  display grid
  grid-template-columns 1fr 1fr
  grid-gap 3vw
  width 80%
  margin auto
  align-items flex-start
  +less-than(tablet)
    width 98%
    grid-template-rows auto
    grid-template-columns auto


.element
  padding 20px
  text-align center

#brand
  .inline
    input
      width 49%

</style>

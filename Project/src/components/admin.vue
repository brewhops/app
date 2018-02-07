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
             <input type="text" placeholder="Name">
             <input type="text" placeholder="Password">
             <button>Submit</button>
         </div>
         <div id="brand">
             <h2>Create New Brand</h2>
             <input type="text" placeholder="Brand ID">
             <input type="text" placeholder="Yeast">
             <div class="inline">
                 <input type="text" placeholder="Dry Hop/Adjunct">
                 <input type="text" placeholder="Rate">
             </div>
             <div class="inline">
                 <input type="text" placeholder="Dry Hop/Adjunct">
                 <input type="text" placeholder="Rate">
             </div>
             <div class="inline">
                 <input type="text" placeholder="Dry Hop/Adjunct">
                 <input type="text" placeholder="Rate">
             </div>
             <div class="inline">
                 <input type="text" placeholder="Dry Hop/Adjunct">
                 <input type="text" placeholder="Rate">
             </div>
             <div class="inline">
                 <input type="text" placeholder="Dry Hop/Adjunct">
                 <input type="text" placeholder="Rate">
             </div>
             <div class="inline">
                 <input type="text" placeholder="Dry Hop/Adjunct">
                 <input type="text" placeholder="Rate">
             </div>
             <div class="inline">
                 <input type="text" placeholder="Dry Hop/Adjunct">
                 <input type="text" placeholder="Rate">
             </div>
             <div class="inline">
                 <input type="text" placeholder="Dry Hop/Adjunct">
                 <input type="text" placeholder="Rate">
             </div>
             <button>Submit</button>
         </div>
     </div>
      </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      msg: ''
    };
  }
};
</script>

<style lang="stylus" scoped>
small = 320px;
mobile = 480px;
tablet = 768px;
laptop = 1024px;
desktop = 1280px;

less-than(size)
  @media screen and (max-width: size)
    {block}

greater-than(size)
  @media screen and (min-width: size)
    {block}

between(size1, size2)
  @media screen and (min-width: size1) and (max-width: size2)
    {block}

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

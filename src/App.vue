

<template>
<div class="container">
  <div class="columns">
    <div class="column is-9">
      <div>
        <h3>Xi ngau</h3>

        <dice v-for="number in numbers" :key="index" :number="number"></dice>
      </div>

      <div>
        <h3>Ban bau cua</h3>
        <div class="bc-table">
          <img src="./assets/baucua.jpg" alt="" class="image"/>
          <div class="bc-overlay"></div>
        </div>
        
      </div>
      
    </div>
    <div class="column is-2">
      <h1>Leaderboard</h1>


      <h1>Notification</h1>
    </div>
  </div>
</div>
  
</template>

<script>
import Dice from './dice.vue';

export default {
  name: "app",
  data() {
    return {
      numbers: [1 , 2, 5],
      msg: "Welcome to Your Vue.js App"
    };
  },
  components: {
    dice: Dice
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

.bc-table {
  position: relative;
}

.bc-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>



<template>
<div class="container is-fullhd">
  <div class="columns">
    <div class="column is-8">
      <div class="columns">
        <div class="column is-6">
          <dice v-for="(number, index) in dices" :key="index" :number="number"></dice>
        </div>
        <div class="column is-6">
          Timer: 1
          <progress class="progress is-success" value="60" max="100">60%</progress>
          <button @click="randomBet" class="button is-primary">Bet</button>
          <button @click="playGame" class="button is-primary">Play</button> <br/>
          <button @click="clearBoard" class="button is-primary">Restart</button>
        </div>
        
      </div>

      <div>
        <div class="bc-table">
          <img src="./assets/baucua.jpg" alt="" class="image bc-image"/>
          <div class="bc-overlay">
            <div class="tokens" v-for="(cell, key) in board">
              <token v-for="token in cell" :key="token.id" v-bind="token"></token>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
    <div class="column is-4">
      <h1 class="title">Bầu cua cùng Code Dạo</h1>

      <div class="content">
        <h3 class="is-medium">Bảng xếp hạng</h3>
        <table class="table is-striped is-narrow">
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Avatar</th>
              <th>Tên</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="player.id" v-for="player in leaderboard">
              <td>{{player.id}}</td>
              <td><img class="avatar" :src="player.avatar" /></td>
              <td>{{player.name}}</td>
              <td>{{player.point}}</td>
            </tr>  
          </tbody> 
        </table>
      </div>
      
      <div class="content">
        <h3 class="is-medium">Thông báo</h3>

        <div class="panel">
          <notification :key="notification.id" 
          v-for="notification in notifications" v-bind="notification" />
        </div>
      </div>
    </div>
  </div>
</div>
  
</template>

<script>
import Dice from "./dice.vue";
import Token from "./token.vue";
import Notification from "./notification.vue";
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: "app",
  methods: {
    ...mapMutations(['removeLosers', 'clearBoard']),
    ...mapActions(['playGame', 'randomBet', 'restart'])
  },
  computed : {
    ...mapState(['dices', 'players', 'board']),
    ...mapGetters(['leaderboard', 'notifications'])
  },
  data() {
    return {
    };
  },
  components: {
    dice: Dice,
    token: Token,
    notification: Notification
  }
};
</script>

<style lang="scss" scoped>
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

.container {
  padding: 0 20px;
  margin-top: 12px;
}

.bc-image {
  opacity: 0.6;
}

.bc-table {
  position: relative;
}

.notification {
  padding: 0.5em;
}

.avatar {
  max-width: 35px;
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

.tokens {
  position: relative;
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

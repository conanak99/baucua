<template>
<div class="container is-fullhd">
  <div class="columns">
    <div class="column is-8">
      <div class="columns">
        <div class="column is-5">
          <dice v-for="(number, index) in dices" :key="index" :number="number"></dice>
        </div>
        <div class="column is-7 content">
          <div>
            <h3 class="is-medium">{{gameStatus}}</h3>
          </div>
          <div class="buttons">
            <button @click="closeBet" class="button is-danger" :disabled="closeBetDisabled">
              <span class="icon">
                <i class="mdi mdi-close-box-outline"></i>
              </span> &nbsp; ĐÓNG SÒNG
            </button>
            <button @click="playGame" class="button is-primary" :disabled="playGameDisabled">
              <span class="icon">
                <i class="mdi mdi-dice-multiple"></i>
              </span> &nbsp; LẮC BẦU CUA
            </button>
            <button @click="restart" class="button is-warning" :disabled="clearBoardDisabled">
              <span class="icon">
                <i class="mdi mdi-cards-playing-outline"></i>
              </span> &nbsp; MỞ SÒNG
            </button>
          </div>
          <!-- 
            <button @click="randomBet" class="button is-small is-primary">Random Bet</button>
          -->    
        </div>
      </div>

      <div>
        <div class="bc-table">
          <img src="./assets/baucua.jpg" alt="" class="image bc-image"/>
          <div class="bc-overlay">
            <div class="tokens" v-for="(cell, key) in board">
              <transition-group tag="div"
                  enter-active-class="animated bounceInDown"
                  leave-active-class="animated fadeOutDown"
               >
                <token v-for="token in cell" :key="token.id" v-bind="token"></token>
              </transition-group>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
    <div class="column is-4">
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
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";

import { WAITING_FOR_BET, WAITING_FOR_ROLL, FINISHED } from './model/GameStatus';

export default {
  name: "app",
  methods: {
    ...mapActions(["playGame", "closeBet", "randomBet", "restart"]),

  },
  computed: {
    ...mapState(["dices", "players", "board", "status"]),
    ...mapGetters(["leaderboard", "notifications", "gameStatus"]),
    closeBetDisabled() {
      return this.status !== WAITING_FOR_BET;
    },
    playGameDisabled() {
      return this.status !== WAITING_FOR_ROLL;
    },
    clearBoardDisabled() {
      return this.status !== FINISHED;
    }
  },
  data() {
    return {};
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

.buttons {
  .button {
    font-weight: bold;
  }
}

h1,
h2, h4 {
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

<template>
  <div class="container is-fullhd">
    <div class="columns">
      <div class="column is-8">
        <div class="columns">
          <div class="column is-5">
            <dice
              v-for="(number, index) in dices"
              :key="index"
              :isRolling="isDiceRolling"
              :number="number"
            ></dice>
          </div>
          <div class="column is-7 content">
            <div>
              <h3
                class="is-medium"
                :class="{ 'has-text-info': status === 'WAITING_FOR_BET' }"
              >
                {{ gameStatus }}
              </h3>
            </div>
            <div class="buttons">
              <button
                @click="closeBet"
                class="button is-danger"
                :disabled="closeBetDisabled"
              >
                <span class="icon">
                  <i class="mdi mdi-close-box-outline"></i>
                </span>
                &nbsp; ĐÓNG SÒNG
              </button>
              <button
                @click="playGame"
                class="button is-primary"
                :disabled="playGameDisabled"
              >
                <span class="icon">
                  <i class="mdi mdi-dice-multiple"></i>
                </span>
                &nbsp; LẮC BẦU CUA
              </button>
              <button
                @click="restart"
                class="button is-warning"
                :disabled="clearBoardDisabled"
              >
                <span class="icon">
                  <i class="mdi mdi-cards-playing-outline"></i>
                </span>
                &nbsp; MỞ SÒNG
              </button>
            </div>
            <!-- <button @click="randomBet" class="button is-small is-primary">
              Random Bet
            </button> -->
          </div>
        </div>

        <div>
          <div class="bc-table">
            <img
              src="./assets/baucua.jpg"
              alt="baucua"
              class="image bc-image"
            />
            <div class="bc-overlay">
              <div class="boards" :key="key" v-for="(cell, key) in board">
                <transition-group
                  tag="div"
                  enter-active-class="animated bounceInDown"
                  leave-active-class="animated fadeOutDown"
                >
                  <token
                    v-for="(token, userId) in cell"
                    :key="userId"
                    v-bind="token"
                  ></token>
                </transition-group>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-4">
        <div class="content">
          <h3 class="is-medium">Luật chơi (Vui là chính)</h3>
          <ul>
            <li>
              Mới chơi được tặng
              <b>20 đồng</b>
            </li>
            <li>
              Mỗi lần cháy túi sẽ được tặng
              <b>4 đồng</b> để gỡ gạc
            </li>
            <li>
              Đặt cược bằng cách
              <b>comment số lượng và lựa chọn</b>:
              <i>2 cua, 4 bầu, 3 cọp</i>
            </li>
            <li>Đặt rồi không được đặt lại (vì tui chưa code)</li>
            <li>
              Tra số điểm tại
              <a href="https://bit.ly/baucuadao">bit.ly/baucuadao</a>
            </li>
          </ul>
        </div>

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
            <transition-group
              name="flip-list"
              enter-active-class="animated slideInRight"
              leave-active-class="animated slideOutRight"
              tag="tbody"
            >
              <tr :key="player.id" v-for="(player, index) in leaderboard">
                <td>{{ index + 1 }}</td>
                <td>
                  <img class="avatar" :src="player.avatar" />
                </td>
                <td>{{ player.name }}</td>
                <td>{{ player.point }}</td>
              </tr>
            </transition-group>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore();

const dices = computed(() => store.state.dices);
const board = computed(() => store.state.board);
const status = computed(() => store.state.status);

const closeBetDisabled = computed(() => status.value !== WAITING_FOR_BET);
const playGameDisabled = computed(() => status.value !== WAITING_FOR_ROLL);
const clearBoardDisabled = computed(() => status.value !== FINISHED);
const isDiceRolling = computed(() => status.value === ROLLING);
</script>

<script lang="ts">
import Dice from "./components/dice.vue";
import Token from "./components/token.vue";
import { mapActions, mapGetters } from "vuex";

import {
  WAITING_FOR_BET,
  ROLLING,
  WAITING_FOR_ROLL,
  FINISHED,
} from "./model/GameStatus";
import { useStore } from "./store";
import { computed } from "vue";

// LOL VUEX/NEXT TYPING IS NOT STABLE NOW, DO NOT BOTHER ADD TYPING FOR THEM
export default {
  name: "app",
  methods: {
    ...mapActions(["playGame", "closeBet", "randomBet", "restart"]),
  },
  computed: {
    ...mapGetters(["leaderboard", "gameStatus"]),
  },
  data() {
    return {};
  },
  components: {
    dice: Dice,
    token: Token,
  },
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

.flip-list-move {
  transition: transform 1s;
}

.buttons {
  .button {
    font-weight: bold;
  }
}

h1,
h2,
h4 {
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

.boards {
  position: relative;
}

.notification {
  padding: 0.5em;
}

.avatar {
  max-width: 35px;
}

a {
  color: #42b983;
}
</style>

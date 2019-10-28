import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import { countBy } from 'lodash';

import util from './util';
import Play from './play';
import Player from './model/Player';
import { WAITING_FOR_BET, WAITING_FOR_ROLL, ROLLING, FINISHED } from './model/GameStatus';

import firebase from './firebase';

const hoang = new Player('1', 'Hoang', 'https://pickaface.net/gallery/avatar/unr_emilee_180112_2136_x9pmt.png');
const minh = new Player('2', 'Minh', 'https://pickaface.net/gallery/avatar/unr_jamal_180112_2132_x9i2f.png');
const long = new Player('3', 'Long', 'https://pickaface.net/gallery/avatar/unr_biba_180112_2131_2kdzozc.png');

const diceRollSound = new Audio('./../assets/dice-roll.mp3');
diceRollSound.volume = 1;

let leaderboardCache = [];

// JS sort take nlogn so we use this with nk instead
function findMaxElements(input, count) {
  // For small array, use sort nlogn
  if (input.length < count * count)
    return input.sort((a, b) => b.point - a.point).slice(0, count);

  // For bigger on, use kn
  for (let index = 0; index < count; index++) {
    for (let i = input.length - 1; i >= 1; i--) {
      if (input[i].point > input[i - 1].point) {
        const temp = input[i];
        input[i] = input[i - 1];
        input[i - 1] = temp;
      }
    }
  }
  return input.slice(0, count);
}

Vue.use(Vuex);
var play = new Play();
const store = new Vuex.Store({
  state: {
    players: {},
    status: WAITING_FOR_BET,
    dices: [1, 2, 3],
    board: {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {}
    }
  },
  mutations: {
    updateDice: (state, dices) => {
      state.dices = dices;
    },
    changeStatus: (state, newStatus) => {
      state.status = newStatus;
    },
    addPlayer: (state, player) => {
      Vue.set(state.players, player.id, player);
    },
    updatePlayerPoint: (state, { playerId, changedValue }) => {
      const player = state.players[playerId];
      if (player) player.point += changedValue;
    },
    placeBet: (state, { player, bet, choice }) => {
      var token = {
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        bet
      };
      Vue.set(state.board[choice], player.id, token);
    },
    removeLosers: (state) => {
      for (const key of Object.keys(state.board)) {
        const keyInt = parseInt(key, 10);
        if (!state.dices.includes(keyInt)) {
          Vue.set(state.board, key, {});
        }
      }
    },
    clearBoard: (state) => {
      for (const key of Object.keys(state.board)) {
        Vue.set(state.board, key, {});
      }
    }
  },
  actions: {
    async rollDice({ commit }) {
      commit('changeStatus', ROLLING);
      diceRollSound.play();
      await util.wait(2300);

      const result = play.getResult();
      commit('updateDice', result);
    },
    placeBet({ commit, state }, { player, bet, choice }) {
      // Can only bet when waiting for bet
      if (state.status !== WAITING_FOR_BET) return;

      if (!state.players[player.id]) {
        commit('addPlayer', player);
      }
      // Can not double bet
      if (state.board[choice][player.id]) return;

      const existedPlayer = state.players[player.id];

      // If player don't have enough point, bet all point
      let pointToBet = bet
      if (existedPlayer.point < pointToBet) {
        pointToBet = existedPlayer.point
      }

      commit('placeBet', { player: existedPlayer, bet: pointToBet, choice });
      commit('updatePlayerPoint', { playerId: existedPlayer.id, changedValue: -pointToBet });
    },
    closeBet({ commit }) {
      commit('changeStatus', WAITING_FOR_ROLL);
    },
    finishGame({ commit, state }) {
      commit('removeLosers');

      var diceDic = countBy(state.dices, dice => dice);
      for (const key in diceDic) {
        const multiplier = diceDic[key] + 1;
        const winners = Object.values(state.board[key]);
        for (const winner of winners) {
          commit('updatePlayerPoint', { playerId: winner.id, changedValue: (winner.bet * multiplier) });
        }
      }

      commit('changeStatus', FINISHED);

      // TODO: Filter for invalid name, avatar, id, point
      const syncPlayer = Object.values(state.players)
        .filter(p => p.id && p.name && p.avatar)
        .sort((p1, p2) => p2.point - p1.point);
      firebase.set(syncPlayer);
    },
    randomBet({ dispatch }) {
      dispatch('placeBet', { player: hoang, bet: 5, choice: 1 })
      dispatch('placeBet', { player: minh, bet: 2, choice: 3 })
      dispatch('placeBet', { player: minh, bet: 5, choice: 2 })
      dispatch('placeBet', { player: long, bet: 5, choice: 2 })
    },
    async playGame({ dispatch }) {
      await dispatch('rollDice');
      dispatch('finishGame');
    },
    restart({ commit, state }) {
      commit('clearBoard');

      // Bonus 2 point for lose users
      for (const player of Object.values(state.players)) {
        if (player.point === 0) {
          commit('updatePlayerPoint', { playerId: player.id, changedValue: 2 });
        }
      }
      commit('changeStatus', WAITING_FOR_BET);
    }
  },
  getters: {
    leaderboard: (state) => {
      // For performance, only recalculate when finished game or when betting
      if (state.status === FINISHED || state.status === WAITING_FOR_BET) {
        const players = Object.values(state.players);
        leaderboardCache = findMaxElements(players, 8);
      }
      return leaderboardCache;
    },
    gameStatus: (state) => {
      switch (state.status) {
        case WAITING_FOR_BET:
          return 'SÒNG ĐANG MỞ. Đặt đi bà con ơi!';
        case WAITING_FOR_ROLL:
          return 'SÒNG ĐANG ĐÓNG. Chờ lắc bầu cua đê!';
        case ROLLING:
          return 'LẮC LẮC LẮC. Bầu cua tôm cá';
        case FINISHED:
          return 'LẮC XONG RỒI. Hốt tiền hốt tiền!';
        default:
          return '';
      }
    }
  }
  // plugins: [createLogger()]
});


export default store;

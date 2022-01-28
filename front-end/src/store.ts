import delay from "delay";
import { createStore, GetterTree, useStore as useVuexStore } from "vuex";

import { countBy } from "lodash";

import Player from "./model/Player";
import {
  WAITING_FOR_BET,
  WAITING_FOR_ROLL,
  ROLLING,
  FINISHED,
} from "./model/GameStatus";
import { getResult } from "./helper/random";
import { findMaxElements } from "./helper/array";
import { BetChoice } from "./model/PlayerBet";
import { syncPlayer } from "./helper/sync";

const DICE_SOUND = new Audio("./../src/assets/dice-roll.mp3");
DICE_SOUND.volume = 1;
const BONUS_POINT = 4;

type Dice = [number, number, number];
interface State {
  players: Record<string, Player>;
  status: string;
  dices: Dice;
  board: Record<number, Record<string, any>>;
}

let leaderboardCache: Player[] = [];

const getters: GetterTree<State, State> = {
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
        return "SÒNG ĐANG MỞ. Đặt đi bà con ơi!";
      case WAITING_FOR_ROLL:
        return "SÒNG ĐANG ĐÓNG. Chờ lắc bầu cua đê!";
      case ROLLING:
        return "LẮC LẮC LẮC. Bầu cua tôm cá";
      case FINISHED:
        return "LẮC XONG RỒI. Hốt tiền hốt tiền!";
      default:
        return "";
    }
  },
};

export const store = createStore<State>({
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
      6: {},
    },
  },
  mutations: {
    updateDice: (state, dices: Dice) => {
      state.dices = dices;
    },
    changeStatus: (state, newStatus: string) => {
      state.status = newStatus;
    },
    addPlayer: (state, player: Player) => {
      state.players[player.id] = player;
    },
    updatePlayerPoint: (state, { playerId, changedValue }) => {
      const player = state.players[playerId];
      if (player) player.point += changedValue;
    },
    placeBet: (state, { player, bet, choice }: BetChoice) => {
      const token = {
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        bet,
      };
      state.board[choice][player.id] = token;
    },
    removeLosers: (state) => {
      for (const key of Object.keys(state.board)) {
        const keyInt = parseInt(key, 10);
        if (!state.dices.includes(keyInt)) {
          state.board[keyInt] = {};
        }
      }
    },
    clearBoard: (state) => {
      for (const key of Object.keys(state.board)) {
        state.board[parseInt(key, 10)] = {};
      }
    },
  },
  actions: {
    async rollDice({ commit }) {
      commit("changeStatus", ROLLING);
      DICE_SOUND.play();
      await delay(2300);

      const result = getResult();
      commit("updateDice", result);
    },
    placeBet({ commit, state }, { player, bet, choice }: BetChoice) {
      // Can only bet when waiting for bet
      if (state.status !== WAITING_FOR_BET) return;

      if (!state.players[player.id]) {
        commit("addPlayer", player);
      }
      // Can not double bet
      if (state.board[choice][player.id]) return;

      const existedPlayer = state.players[player.id];
      if (existedPlayer.point === 0) {
        return;
      }

      // If player don't have enough point, bet all point
      let pointToBet = bet;
      if (existedPlayer.point < pointToBet) {
        pointToBet = existedPlayer.point;
      }

      commit("placeBet", { player: existedPlayer, bet: pointToBet, choice });
      commit("updatePlayerPoint", {
        playerId: existedPlayer.id,
        changedValue: -pointToBet,
      });
    },
    closeBet({ commit }) {
      commit("changeStatus", WAITING_FOR_ROLL);
    },
    finishGame({ commit, state }) {
      commit("removeLosers");

      var diceDic = countBy(state.dices, (dice) => dice);
      for (const key in diceDic) {
        const multiplier = diceDic[key] + 1;
        const winners = Object.values(state.board[parseInt(key, 10)]);
        for (const winner of winners) {
          commit("updatePlayerPoint", {
            playerId: winner.id,
            changedValue: winner.bet * multiplier,
          });
        }
      }

      commit("changeStatus", FINISHED);

      syncPlayer(Object.values(state.players));
    },
    randomBet({ dispatch }) {
      const hoang = new Player(
        "1",
        "Hoang",
        "https://pickaface.net/gallery/avatar/unr_emilee_180112_2136_x9pmt.png"
      );
      const minh = new Player(
        "2",
        "Minh",
        "https://pickaface.net/gallery/avatar/unr_jamal_180112_2132_x9i2f.png"
      );
      const long = new Player(
        "3",
        "Long",
        "https://pickaface.net/gallery/avatar/unr_biba_180112_2131_2kdzozc.png"
      );

      dispatch("placeBet", { player: hoang, bet: 5, choice: 1 });
      dispatch("placeBet", { player: minh, bet: 2, choice: 3 });
      dispatch("placeBet", { player: minh, bet: 5, choice: 2 });
      dispatch("placeBet", { player: long, bet: 5, choice: 2 });
    },
    async playGame({ dispatch }) {
      await dispatch("rollDice");
      dispatch("finishGame");
    },
    restart({ commit, state }) {
      commit("clearBoard");

      // Bonus points for lose/near-lose users to 4 points
      for (const player of Object.values(state.players)) {
        if (player.point < BONUS_POINT) {
          commit("updatePlayerPoint", {
            playerId: player.id,
            changedValue: BONUS_POINT - player.point,
          });
        }
      }
      commit("changeStatus", WAITING_FOR_BET);
    },
  },
  getters,
  // plugins: [createLogger()]
});

type storeType = typeof store & { getters: typeof getters };

export default store;
export function useStore(): storeType {
  return useVuexStore();
}

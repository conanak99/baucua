import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import util from './util';
import Play from './play';
import Player from './model/Player';
import Notification from './model/Notification';
import { WAITING_FOR_BET, WAITING_FOR_ROLL, ROLLING, FINISHED } from './model/GameStatus';

const hoang = new Player('1', 'Hoang', 'https://pickaface.net/gallery/avatar/unr_emilee_180112_2136_x9pmt.png');
const minh = new Player('2', 'Minh', 'https://pickaface.net/gallery/avatar/unr_jamal_180112_2132_x9i2f.png');
const long = new Player('3', 'Long', 'https://pickaface.net/gallery/avatar/unr_biba_180112_2131_2kdzozc.png');

const diceRollSound = new Audio('./../assets/dice-roll.mp3');
diceRollSound.volume = 1;


Vue.use(Vuex);
var play = new Play();
const store = new Vuex.Store({
    state: {
        players: [],
        status: WAITING_FOR_BET,
        notifications: [],
        dices: [1, 2, 3],
        board: {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: []
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
            state.players.push(player);
        },
        updatePlayerPoint: (state, { playerId, changedValue }) => {
            const player = state.players.find(p => p.id === playerId);
            player.point += changedValue;
        },
        placeBet: (state, { player, bet, choice }) => {
            state.board[choice].push({
                id: player.id,
                name: player.name,
                avatar: player.avatar,
                bet
            });
        },
        removeLosers: (state) => {
            for (const key of Object.keys(state.board)) {
                const keyInt = parseInt(key, 10);
                if (!state.dices.includes(keyInt)) {
                    state.board[key] = [];
                }
            }
        },
        clearBoard: (state) => {
            for (const key of Object.keys(state.board)) {
                state.board[key] = [];
            }
        },
        addNotification: (state, notification) => {
            notification.id = state.notifications.length;
            state.notifications.unshift(notification);
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

            if (!state.players.some(p => p.id === player.id)) {
                commit('addPlayer', player);
            }
            const existedPlayer = state.players.find(p => p.id === player.id);
            // Can not double bet
            if (state.board[choice].some(p => p.id === existedPlayer.id)) return;

            if (existedPlayer.point < bet) return;

            if (existedPlayer.point >= bet) {
                commit('placeBet', { player: existedPlayer, bet, choice });
                commit('updatePlayerPoint', { playerId: existedPlayer.id, changedValue: -bet });
                commit('addNotification', new Notification(existedPlayer, bet, choice));
            }
        },
        closeBet({ commit }) {
            commit('changeStatus', WAITING_FOR_ROLL);
        },
        finishGame({ commit, state }) {
            commit('removeLosers');

            const dices = state.dices;
            // Return bet money
            var dicesDistinct = [...new Set(dices)];
            for (const dice of dicesDistinct) {
                const winners = state.board[dice];
                for (const winner of winners) {
                    commit('updatePlayerPoint', { playerId: winner.id, changedValue: winner.bet });
                }
            }

            // Add reward money
            for (const dice of dices) {
                const winners = state.board[dice];
                for (const winner of winners) {
                    commit('updatePlayerPoint', { playerId: winner.id, changedValue: winner.bet });
                }
            }
            commit('changeStatus', FINISHED);
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
            for (const player of state.players) {
                if (player.point === 0) {
                    commit('updatePlayerPoint', { playerId: player.id, changedValue: 2 });
                }
            }
            commit('changeStatus', WAITING_FOR_BET);
        }
    },
    getters: {
        leaderboard: (state) => {
            var players = [...state.players];
            return players.sort((p1, p2) => p2.point - p1.point).slice(0, 5);
        },
        notifications: (state) => {
            return state.notifications.slice(0, 5);
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
    },
    plugins: [createLogger()]
});

export default store;
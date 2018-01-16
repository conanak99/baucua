import Vue from 'vue';
import Vuex from 'vuex';
import Play from './play';

var play = new Play();

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        players: [],
        notifications: [],
        dices: [ 1, 2, 3],
        tokens: {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': []
        }
    },
    mutations: {
        rollDice: (state) => {
            const result = play.getResult();
            state.dices = result;
        }
    },
    getters: {
        leaderboard: (state) => {

        }
    }
});

export default store;
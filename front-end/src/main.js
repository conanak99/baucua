import Vue from 'vue';
import App from './App.vue';

import Player from './model/Player';
import store from './store';
import "./styles/app.scss";

import io from 'socket.io-client';
const socket = io('http://localhost:3002');

socket.on('connect', () => { console.log('connected') });
socket.on('newBet', function(newBet) {
    const { id, name, avatar, bet, choice } = newBet;
    const player = new Player(id, name, avatar);
    store.dispatch('placeBet', { player, bet, choice });
});

new Vue({
    el: '#app',
    store,
    render: h => h(App)
});
import Vue from 'vue';
import App from './App.vue';

import firebase from 'firebase/app';
import * as auth from 'firebase/auth';
import * as db from 'firebase/database';

import Player from './model/Player';
import store from './store';
import "./styles/app.scss";

import * as config from './../../firebase-config.json';
import * as user from './../../firebase-user.json';

firebase.initializeApp(config);

firebase.auth().signInWithEmailAndPassword(user.email, user.password);

const database = firebase.database();
const betsRef = database.ref('bets');

betsRef.on('child_added', (snapshot) => {
    var child = snapshot.val();
    const { id, name, avatar, bet, choice } = child;
    const player = new Player(id, name, avatar);
    console.log(child);
    store.dispatch('placeBet', { player, bet, choice });
});

new Vue({
    el: '#app',
    store,
    render: h => h(App)
});
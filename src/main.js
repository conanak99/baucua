import Vue from 'vue';
import App from './App.vue';
import VueFire from 'vuefire';
import firebase from 'firebase/app';
import * as auth from 'firebase/auth';
import * as db from 'firebase/database';

import store from './store';
import "./styles/app.scss";

import * as config from './assets/firebase-config.json';
firebase.initializeApp(config);

Vue.use(VueFire);
new Vue({
    el: '#app',
    store,
    render: h => h(App)
});
import firebase from 'firebase/app';
import * as auth from 'firebase/auth';
import * as db from 'firebase/database';
import * as config from './../../firebase-config.json';
import * as user from './../../firebase-user.json';

firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword(user.email, user.password);
const playerRef = firebase.database().ref('players');

export default playerRef;
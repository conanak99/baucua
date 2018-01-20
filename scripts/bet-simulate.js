const firebase = require('firebase');
require('firebase/auth');
require('firebase/database');

const user = require('./../firebase-user');

const config = require('./../firebase-config.json');
firebase.initializeApp(config);

const hoang = { id: 1, name: 'Hoang', avatar: 'https://pickaface.net/gallery/avatar/unr_emilee_180112_2136_x9pmt.png' };
const minh = { id: 2, name: 'Minh', avatar: 'https://pickaface.net/gallery/avatar/unr_jamal_180112_2132_x9i2f.png' };
const long = { id: 3, name: 'Long', avatar: 'https://pickaface.net/gallery/avatar/unr_biba_180112_2131_2kdzozc.png' };

var players = [
    {...hoang, bet: 5, choice: 1 },
    {...minh, bet: 2, choice: 2 },
    {...long, bet: 3, choice: 3 }
];

(async() => {
    console.log('begin to login');
    await firebase.auth().signInWithEmailAndPassword(user.email, user.password);

    const database = firebase.database();
    const betsRef = database.ref('bets');

    console.log('finished login');
    for (const player of players) {
        console.log('push', player);
        betsRef.push(player);
        await wait(2);
    }
    betsRef.remove();
    console.log('Cleared');
})();

function wait(second) {
    return new Promise(resolve => setTimeout(resolve, second * 1000));
}
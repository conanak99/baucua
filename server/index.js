const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');

const firebase = require('firebase');
require('firebase/auth');
require('firebase/database');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const user = require('./config/secret');
const config = require('./config/firebase-config');
firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword(user.email, user.password);

const database = firebase.database();
const betsRef = database.ref('bets');
const HookProcessor = require('./hookProcessor');

const process = new HookProcessor('1093212670720847_1822684147773692', betsRef);

app.get('/', (req, res) => {
    res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) {
    if (req.query['hub.verify_token'] === 'anh_hoang_dep_trai_vo_doi') {
        res.send(req.query['hub.challenge']);
        return;
    }
    res.send('Error, wrong validation token');
});

app.post('/webhook', async(req, res) => {
    const hookObject = req.body;
    console.log(JSON.stringify(hookObject, null, 2));
    await process.processHook(hookObject);

    res.status(200).send("OK");
});


const ip = "127.0.0.1"; // process.env.IP || "127.0.0.1";
const port = "3002"; // process.env.PORT || 3002;

var server = http.createServer(app);
server.listen(port, ip, function() {
    console.log("Express server listening at %s:%d ", ip, port);
});
const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

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

app.post('/webhook', function(req, res) {
    var entries = JSON.stringify(req.body, null, 2);
    console.log(entries);
    res.status(200).send("OK");
});



const ip = process.env.IP || "127.0.0.1";
const port = process.env.PORT || 3002;

var server = http.createServer(app);
server.listen(port, ip, function() {
    console.log("Express server listening at %s:%d ", ip, port);
});
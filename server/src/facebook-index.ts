// @flow
import http from "http";
import logger from "morgan";
import bodyParser from "body-parser";
import express from "express";
import { Server } from "socket.io";
import "dotenv/config";

const app = express();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// SEEM NOT WORK BECAUSE OF A LOT OF FACEBOOK PERMISSION THINGS.....

import HookProcessor from "./hookProcessor";
const processor = new HookProcessor(io, "116529085375415_566172007077785");

// const LoadTester = require("./loadTester");
// const loadTester = new LoadTester(io);

// For load testing
// app.get("/load/:num", async (req, res) => {
//   const numberOfUser = parseInt(req.params.num, 10) || 1000;
//   await loadTester.runLoadTest(numberOfUser);
//   res.status(200).send("OK");
// });

app.get("/", (req, res) => {
  res.send("Home page. Webhook running okay.");
});

app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "anh_hoang_dep_trai_vo_doi") {
    res.send(req.query["hub.challenge"]);
    return;
  }
  res.send("Error, wrong validation token");
});

// Need to subscribe to "feed"
app.post("/webhook", async (req, res) => {
  const hookObject = req.body;
  console.log(JSON.stringify(hookObject, null, 2));
  await processor.processHook(hookObject);

  res.status(200).send("OK");
});

const ip = "127.0.0.1"; // process.env.IP || "127.0.0.1";
const port = 3002; // process.env.PORT || 3002;

server.listen(port, ip, function () {
  console.log("Express server listening at %s:%d ", ip, port);
});

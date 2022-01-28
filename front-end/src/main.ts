import { createApp } from "vue";
import io from "socket.io-client";
import { store } from "./store";

import App from "./App.vue";
import Player from "./model/Player";
import { BetChoice, PlayerBet } from "./model/PlayerBet";

const socket = io("http://localhost:3002");

socket.on("connect", () => {
  console.log("connected");
});
socket.on("newBet", function (newBet: PlayerBet) {
  const { id, name, avatar, bet, choice } = newBet;
  const player = new Player(id, name, avatar);
  const betChoice: BetChoice = { player, bet, choice };
  store.dispatch("placeBet", betChoice);
});

createApp(App).use(store).mount("#app");

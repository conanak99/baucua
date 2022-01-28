import { numberToChoiceMap } from "./ChoiceMap";
import Player from "./Player";

class Notification {
  player: Player;
  bet: any;
  choice: string;
  createdTime: Date;

  constructor(player: Player, bet: any, choice: number) {
    this.player = player;
    this.bet = bet;
    this.choice = numberToChoiceMap[choice];
    this.createdTime = new Date();
  }
}

export default Notification;

import Player from "./Player";

export interface PlayerBet {
  id: string;
  name: string;
  avatar: string;
  bet: number;
  choice: number;
}

export interface BetChoice {
  player: Player;
  bet: number;
  choice: number;
}

import Player from "../model/Player";

const SCORE_URL: string = import.meta.env.VITE_SCORE_URL || "";
const SCORE_PASSWORD = import.meta.env.VITE_SCORE_PASSWORD || "";

export const syncPlayer = async (players: Player[]) => {
  const playerToSync = players
    .filter((p) => p.id && p.name && p.avatar)
    .sort((p1, p2) => p2.point - p1.point);

  await fetch(SCORE_URL + "/score", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: SCORE_PASSWORD, newScore: playerToSync }),
  });
};

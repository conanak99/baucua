import { range } from "lodash";

export function getRandomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (1 + max - min));
}

export function getResult() {
  return range(3).map(() => getRandomInt(1, 6));
}

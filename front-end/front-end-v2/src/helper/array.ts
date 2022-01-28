import Player from "../model/Player";

// JS sort take nlogn so we use this with nk instead
export function findMaxElements(input: Player[], count: number) {
  // For small array, use sort nlogn
  if (input.length < count * count)
    return input.sort((a, b) => b.point - a.point).slice(0, count);

  // For bigger on, use kn
  for (let index = 0; index < count; index++) {
    for (let i = input.length - 1; i >= 1; i--) {
      if (input[i].point > input[i - 1].point) {
        const temp = input[i];
        input[i] = input[i - 1];
        input[i - 1] = temp;
      }
    }
  }
  return input.slice(0, count);
}

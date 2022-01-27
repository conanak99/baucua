import each from "jest-each";
import HookProcessor from "../src/hookProcessor";

const processor = new HookProcessor({ emit: (a, b) => {} });

describe("test-parser", () => {
  each([
    [
      "5 BẦU 4 gà",
      [
        { bet: 5, choice: 2 },
        { bet: 4, choice: 3 },
      ],
    ],
    [
      "Cho em đặt 5 cọp,6 gà 3 CUA",
      [
        { bet: 5, choice: 1 },
        { bet: 6, choice: 3 },
        { bet: 3, choice: 6 },
      ],
    ],
    ["6 cua", [{ bet: 6, choice: 6 }]],
    [
      "1 cua 1 ga 1 cop",
      [
        { bet: 1, choice: 6 },
        { bet: 1, choice: 3 },
        { bet: 1, choice: 1 },
      ],
    ],
    [
      "sáu cua 3 gà",
      [
        { bet: 6, choice: 6 },
        { bet: 3, choice: 3 },
      ],
    ],
    [
      "10-gà, 2CUA",
      [
        { bet: 10, choice: 3 },
        { bet: 2, choice: 6 },
      ],
    ],
  ]).test("Should return parsed result for valid bet", (input, result) => {
    expect(processor.getBetFromComment(input)).toEqual(result);
  });

  each([
    ["em đặt cho vui"],
    ["hay quá ad ơi"],
    ["cho em xin source code"],
    ["thắng cmr"],
    ["bầu cua tôm cá gà nai"],
  ]).it("Should return empty array for invalid bet", (input) => {
    expect(processor.getBetFromComment(input)).toEqual([]);
  });
});

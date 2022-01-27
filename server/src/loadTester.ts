import mockData from "./../config/mockdata.json";

type Emitter = {
  emit(name: string, event: Object): void;
};

export default class LoadTester {
  emitter: Emitter;

  constructor(emitter: Emitter) {
    this.emitter = emitter;
  }

  getRandomInt(min: number, max: number): number {
    return min + Math.floor(Math.random() * Math.floor(max - min + 1));
  }

  getRandomUser() {
    return mockData[this.getRandomInt(0, mockData.length - 1)];
  }

  wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async runLoadTest(numberOfUser: number) {
    const players = [];
    for (let index = 0; index < numberOfUser; index++) {
      const user = this.getRandomUser();
      const player = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        bet: this.getRandomInt(1, 30),
        choice: this.getRandomInt(1, 6),
      };
      players.push(player);
    }

    for (const player of players) {
      await this.wait(50);
      this.emitter.emit("newBet", player);
    }
  }
}

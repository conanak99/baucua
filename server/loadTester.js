const mockData = require('./mockdata');
class LoadTester {
    constructor(emitter) {
        this.emitter = emitter;
    }

    getRandomInt(min, max) {
        return min + Math.floor(Math.random() * Math.floor(max - min + 1));
    }

    getRandomUser() {
        return mockData[this.getRandomInt(0, mockData.length - 1)];
    }

    wait(miliseconds) {
        return new Promise((resolve) => setTimeout(resolve, miliseconds));
    }

    async runLoadTest(numberOfUser) {
        const players = [];
        for (let index = 0; index < numberOfUser; index++) {
            const user = this.getRandomUser();
            const player = {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                bet: this.getRandomInt(1, 4),
                choice: this.getRandomInt(1, 6)
            };
            players.push(player);
        }

        for (const player of players) {
            await this.wait(10);
            this.emitter.emit('newBet', player);
        }
    }
}

module.exports = LoadTester;
import { range } from 'lodash';

class Play {
    getRandomInt(min, max) {
        return min + Math.floor(Math.random() * Math.floor(max - min + 1));
    }

    getResult() {
        return range(3)
            .map(() => this.getRandomInt(1, 6));
    }
}

export default Play;
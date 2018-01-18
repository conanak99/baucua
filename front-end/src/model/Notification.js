import { numberToChoiceMap } from './ChoiceMap';

class Notification {
    constructor(player, bet, choice) {
        this.player = player;
        this.bet = bet;
        this.choice = numberToChoiceMap[choice];
        this.createdTime = new Date();
    }
}

export default Notification;
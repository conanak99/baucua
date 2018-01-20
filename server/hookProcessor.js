const textParser = require('./textParser');
const api = require('./api');

const choiceToNumberMap = {
    'cop': 1,
    'bau': 2,
    'ga': 3,
    'tom': 4,
    'ca': 5,
    'cua': 6
};

class HookProcessor {
    constructor(postId, firebaseRef) {
        this.postId = postId;
        this.firebaseRef = firebaseRef;
    }

    async processHook(hookObject) {
        for (const entry of hookObject.entry) {
            for (const change of entry.changes) {
                this.processEntryChange(change);
            }
        }
    }

    async processEntryChange(change) {
        if (change.field !== 'feed') return;

        // New comment only
        const changeValue = change.value;
        if (changeValue.post_id !== this.postId) return;
        if (changeValue.item !== 'comment' || changeValue.verb !== 'add') return;

        var { sender_id, sender_name, message } = changeValue;

        const bets = this.getBetFromComment(message);
        console.log(bets);
        if (bets.length === 0) return;

        const avatar = await api.getAvatar(sender_id);
        for (const bet of bets) {
            const playerAndBet = {
                id: sender_id,
                name: sender_name,
                avatar,
                bet: bet.bet,
                choice: bet.choice
            };
            console.log(playerAndBet);
            this.firebaseRef.push(playerAndBet);
        }
    }

    getBetFromComment(comment) {
        const cleanedComment = textParser.charToNumber(
            textParser.removeUnicode(comment.toLowerCase()));

        const regex = /(\d+)( |-)?(cop|bau|ga|tom|ca|cua)/g;
        const matches = cleanedComment.match(regex);

        if (!matches) return [];

        const bets = matches.map(match => {
            const execMatch = regex.exec(match);
            // Remove a bug of exec failling every second time
            regex.exec(match);

            const bet = parseInt(execMatch[1], 10);
            const choice = choiceToNumberMap[execMatch[3]];
            return { bet, choice };
        });
        return bets;
    }
}

module.exports = HookProcessor;
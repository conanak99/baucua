// @flow

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

type Emitter = {
    emit(name: string, event: Object): void
};
type Bet = {
    bet: number,
    choice: number
};
type Change = {
    field: string,
    value: {
        sender_id: string,
        sender_name: string,
        message: string
    },
    post_id: string,
    item: string,
    verb: string
};
type Entry = {
    changes: Array < Change >
};

class HookProcessor {
    postId: string;
    emitter: Emitter;

    constructor(postId: string, emitter: Emitter) {
        this.postId = postId;
        this.emitter = emitter;
    }

    processYoutubeComments(comments) {
        // Process new comment
        for (const comment of comments) {
            const bets = this.getBetFromComment(comment.text);

            if (bets.length === 0) continue;

            for (const bet of bets) {
                const playerAndBet = {
                    id: comment.userId,
                    name: comment.username,
                    avatar: comment.avatar,
                    bet: bet.bet,
                    choice: bet.choice
                };
                // console.log(playerAndBet);
                this.emitter.emit('newBet', playerAndBet);
            }
        }
    }    

    async processHook(hookObject: { entry: Array < Entry > }) {
        for (const entry of hookObject.entry) {
            for (const change of entry.changes) {
                this.processEntryChange(change);
            }
        }
    }

    async processEntryChange(change: Change) {
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
            this.emitter.emit('newBet', playerAndBet);
        }
    }

    getBetFromComment(comment: string): Array < Bet > {
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
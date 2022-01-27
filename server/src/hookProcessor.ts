import { textParser } from "./textParser";

const choiceToNumberMap: Record<string, number> = {
  cop: 1,
  bau: 2,
  ga: 3,
  tom: 4,
  ca: 5,
  cua: 6,
};

interface Emitter {
  emit(name: string, event: Object): void;
}
interface Bet {
  bet: number;
  choice: number;
}
interface Change {
  field: string;
  value: {
    sender_id: string;
    sender_name: string;
    message: string;
  };
  post_id: string;
  item: string;
  verb: string;
}
interface Entry {
  changes: Array<Change>;
}

export default class HookProcessor {
  postId?: string;
  emitter: Emitter;

  constructor(emitter: Emitter, postId?: string) {
    this.emitter = emitter;
    this.postId = postId;
  }

  processYoutubeComments(comments: any) {
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
          choice: bet.choice,
        };
        // console.log(playerAndBet);
        this.emitter.emit("newBet", playerAndBet);
      }
    }
  }

  // async processHook(hookObject: { entry: Array<Entry> }) {
  //   for (const entry of hookObject.entry) {
  //     for (const change of entry.changes) {
  //       this.processEntryChange(change);
  //     }
  //   }
  // }

  // async processEntryChange(change: Change) {
  //   if (change.field !== "feed") return;

  //   // New comment only
  //   const changeValue = change.value;
  //   if (changeValue.post_id !== this.postId) return;
  //   if (changeValue.item !== "comment" || changeValue.verb !== "add") return;

  //   var { sender_id, sender_name, message } = changeValue;

  //   const bets = this.getBetFromComment(message);
  //   console.log(bets);
  //   if (bets.length === 0) return;

  //   const avatar = await api.getAvatar(sender_id);
  //   for (const bet of bets) {
  //     const playerAndBet = {
  //       id: sender_id,
  //       name: sender_name,
  //       avatar,
  //       bet: bet.bet,
  //       choice: bet.choice,
  //     };
  //     console.log(playerAndBet);
  //     this.emitter.emit("newBet", playerAndBet);
  //   }
  // }

  getBetFromComment(comment: string): Array<Bet> {
    const cleanedComment = textParser.charToNumber(
      textParser.removeUnicode(comment.toLowerCase())
    );

    const regex = /(\d+)( |-)?(cop|bau|ga|tom|ca|cua)/g;
    const matches = cleanedComment.match(regex);

    if (!matches) return [];

    const bets = matches.map((match) => {
      const execMatch = regex.exec(match);
      // Remove a bug of exec failling every second time
      regex.lastIndex = 0;

      const bet = parseInt(execMatch![1], 10);
      const choice = choiceToNumberMap[execMatch![3]];
      return {
        bet,
        choice,
      };
    });

    return bets;
  }
}

module.exports = HookProcessor;

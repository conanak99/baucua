import { textParser } from "./textParser";
import { Comment } from "./models/comment";
import { PlayerBet } from "./models/player-bet";
import { getAvatar, getPost } from "./api";

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
    item: "comment" | "reaction";
    post_id: string;
    parent_id?: string;
    verb: string;
    created_time: number;
    message: string;
    from: {
      name: string;
      id: string;
    };
  };
}

interface Entry {
  id: string;
  time: number;
  changes: Change[];
}

export default class HookProcessor {
  postId?: string;
  emitter: Emitter;

  constructor(emitter: Emitter, postId?: string) {
    this.emitter = emitter;
    this.postId = postId;
  }

  processYoutubeComments(comments: Comment[]) {
    // Process new comment
    for (const comment of comments) {
      const bets = this.getBetFromComment(comment.text);

      if (bets.length === 0) continue;

      for (const bet of bets) {
        const playerBet: PlayerBet = {
          id: comment.userId,
          name: comment.username,
          avatar: comment.avatar,
          bet: bet.bet,
          choice: bet.choice,
        };
        console.log(playerBet);
        this.emitter.emit("newBet", playerBet);
      }
    }
  }

  async processHook(hookObject: { entry: Entry[] }) {
    for (const entry of hookObject.entry) {
      for (const change of entry.changes) {
        this.processEntryChange(change);
      }
    }
  }

  async shouldProcessChange(change: Change): Promise<boolean> {
    if (change.field !== "feed") false;
    const changeValue = change.value;
    if (changeValue.item !== "comment" || changeValue.verb !== "add")
      return false;

    const post = await getPost(changeValue.post_id);
    // Post must contains #baucua hashtag
    if (!post.message.includes("#baucua")) {
      return false;
    }

    return true;
  }

  async processEntryChange(change: Change) {
    const shouldProcessChange = await this.shouldProcessChange(change);
    if (!shouldProcessChange) {
      return;
    }

    const {
      from: { id, name },
      message,
    } = change.value;

    const bets = this.getBetFromComment(message);
    console.log(bets);
    if (bets.length === 0) return;

    const avatar = await getAvatar(id);
    for (const bet of bets) {
      const playerAndBet: PlayerBet = {
        id,
        name,
        avatar,
        bet: bet.bet,
        choice: bet.choice,
      };
      console.log(playerAndBet);
      this.emitter.emit("newBet", playerAndBet);
    }
  }

  getBetFromComment(comment: string): Bet[] {
    const cleanedComment = textParser.charToNumber(
      textParser.removeUnicode(comment.toLowerCase())
    );

    const regex = /(\d+)( |-)?(cop|bau|ga|tom|ca|cua)/g;
    const matches = cleanedComment.match(regex);

    if (!matches) return [];

    const bets = matches.map((match) => {
      const execMatch = regex.exec(match);
      // Remove a bug of exec failing every second time
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

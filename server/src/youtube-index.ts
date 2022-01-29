import delay from "delay";
import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";

import { Comment } from "./models/comment";
import { YOUTUBE_ACCESS_TOKEN } from "./../config/secret";
import HookProcessor from "./hookProcessor";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
httpServer.listen(3002);
const hookProcessor = new HookProcessor(io);

let lastCommentId = "";
let currentPageToken = "";
const COMMENT_MAX_RESULT = 200;

// WARNING: ACCESS_TOKEN is only available in 50 minutes
// So in 40 minutes, reset the app and change to a new ACCESS_TOKEN
// Wait until "sòng đang đóng" so nobody can bet

function getNewComments(allComments: Comment[], lastCommentId: string) {
  if (!allComments || allComments.length === 0) return [];

  // New page or comment id is not set
  if (allComments.every((comment) => comment.id !== lastCommentId)) {
    return allComments;
  } else {
    const result = [];
    let ignore = true;

    // Comments are sorted from oldest to newest
    // So we need to ignore the comment BEFORE last comment
    for (const comment of allComments) {
      if (!ignore) {
        result.push(comment);
      }

      // Loop until found processed
      if (comment.id === lastCommentId) ignore = false;
    }
    return result;
  }
}

interface LiveChatMessage {
  id: string;
  snippet: {
    displayMessage: string;
  };
  authorDetails: {
    channelId: string;
    displayName: string;
    profileImageUrl: string;
  };
}
interface LiveChatResponse {
  items: LiveChatMessage[];
  pollingIntervalMillis: number;
  nextPageToken: string;
}

interface LiveBroadcast {
  id: string;
  snippet: {
    title: string;
    description: string;
    liveChatId: string;
  };
  status: {
    lifeCycleStatus: "complete" | "live" | "ready" | "created" | "testing";
  };
}
interface LiveBroadcastResponse {
  items: LiveBroadcast[];
}

async function getLiveBroadcast() {
  const url =
    "https://www.googleapis.com/youtube/v3/liveBroadcasts?mine=true&maxResults=50";
  const response = await axios.get<LiveBroadcastResponse>(url, {
    headers: {
      Authorization: `Bearer ${YOUTUBE_ACCESS_TOKEN}`,
    },
  });
  return response.data.items;
}

async function getLiveChat(liveChatId: string, pageToken = "") {
  const url = "https://www.googleapis.com/youtube/v3/liveChat/messages";
  const response = await axios.get<LiveChatResponse>(url, {
    params: {
      part: "id,snippet,authorDetails",
      liveChatId,
      profileImageSize: 100,
      maxResults: COMMENT_MAX_RESULT,
      pageToken,
    },
    headers: {
      Authorization: `Bearer ${YOUTUBE_ACCESS_TOKEN}`,
    },
  });

  const result = response.data;
  const pollingTime = result.pollingIntervalMillis;
  const nextPageToken = result.nextPageToken;
  const comments: Comment[] = result.items.map((item) => ({
    id: item.id,
    text: item.snippet.displayMessage,
    userId: item.authorDetails.channelId,
    username: item.authorDetails.displayName,
    avatar: item.authorDetails.profileImageUrl,
  }));

  return {
    pollingTime,
    nextPageToken,
    comments,
  };
}

async function run() {
  const myBroadcasts = await getLiveBroadcast();
  const baucuaLive = myBroadcasts.find(
    (broadcast) =>
      (broadcast.snippet.description.includes("#baucua") &&
        broadcast.status.lifeCycleStatus === "live") ||
      broadcast.status.lifeCycleStatus === "ready" //
  );

  if (!baucuaLive) {
    console.error("Can not find livestream for baucua!");
    return;
  } else {
    console.log("Found livestream for baucua:", baucuaLive.snippet);
  }

  while (true) {
    console.log("Start getting comments");
    // Youtube always return 75 items only, it's very weird
    const { pollingTime, nextPageToken, comments } = await getLiveChat(
      baucuaLive.snippet.liveChatId,
      currentPageToken
    );
    if (comments.length === COMMENT_MAX_RESULT) {
      currentPageToken = nextPageToken;
    }

    const newComments = getNewComments(comments, lastCommentId);
    console.log(`Found ${newComments.length} new comments`);
    if (newComments.length > 0) {
      lastCommentId = newComments[newComments.length - 1].id;
      console.log(JSON.stringify(newComments, null, 2));
    }

    hookProcessor.processYoutubeComments(newComments);
    console.log(`Pool for ${pollingTime / 1000}s before continue`);
    await delay(pollingTime);
  }
}

run();

import delay from "delay";
import axios from "axios";
import { Server } from "socket.io";

const io = new Server(3002);

import { ACCESS_TOKEN } from "./../config/secret";
import HookProcessor from "./hookProcessor";
const hookProcessor = new HookProcessor(io);

let lastCommentId = "";
let currentPageToken = "";
const COMMENT_MAX_RESULT = 200;

async function run() {
  while (true) {
    console.log("Start getting comments");
    // Youtube always return 75 items only, it's very weird
    const { pollingTime, nextPageToken, comments } = await getLiveChat(
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

function getNewComments(allComments: any, lastCommentId: any) {
  if (!allComments || allComments.length === 0) return [];

  // New page or comment id is not set
  if (allComments.every((comment: any) => comment.id !== lastCommentId)) {
    return allComments;
  } else {
    const result = [];
    let processed = true;
    for (const comment of allComments) {
      if (!processed) {
        result.push(comment);
      }
      // Loop until found processed
      if (comment.id === lastCommentId) processed = false;
    }
    return result;
  }
}

async function getLiveChat(pageToken = "") {
  const url = "https://www.googleapis.com/youtube/v3/liveChat/messages";
  const response = await axios.get<any>(url, {
    params: {
      part: "id,snippet,authorDetails",
      liveChatId: "EiEKGFVDZFY5dG43OXYzZWNTRHBDMUFqVkthdxIFL2xpdmU",
      profileImageSize: 100,
      maxResults: COMMENT_MAX_RESULT,
      pageToken,
    },
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  const result = response.data;
  const pollingTime = result.pollingIntervalMillis;
  const nextPageToken = result.nextPageToken;
  const comments = result.items.map((item: any) => ({
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

run();

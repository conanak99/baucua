const delay = require('delay');
const request = require('request-promise');
const io = require('socket.io')(3002);

const { youtubeAPIKeys } = require('./../config/secret');
const HookProcessor = require('./hookProcessor');
const hookProcessor = new HookProcessor(null, io);

let lastCommentId = null;
let currentPageToken = null;
const COMMENT_MAX_RESULT = 200

async function run() {
    while (true) {
        console.log('Start getting comments');
        // Youtube always return 75 items only, it's very weird
        const { pollingTime, nextPageToken, comments } = await getLiveChat(currentPageToken);
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

function getNewComments(allComments, lastCommentId) {
    if (!allComments || allComments.length === 0) return [];

    // New page or comment id is not set
    if (allComments.every(comment => comment.id !== lastCommentId)) {
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

function getApiKey() {
    const randomIndex = Math.floor(Math.random() * (youtubeAPIKeys.length))
    return youtubeAPIKeys[randomIndex]
}

async function getLiveChat(pageToken = null) {
    const youtubeAPIKey = getApiKey()
    const url = 'https://www.googleapis.com/youtube/v3/liveChat/messages';
    const result = await request({
        uri: url,
        qs: {
            part: 'id,snippet,authorDetails',
            liveChatId: 'EiEKGFVDZFY5dG43OXYzZWNTRHBDMUFqVkthdxIFL2xpdmU',
            profileImageSize: 100,
            maxResults: COMMENT_MAX_RESULT,
            pageToken,
            key: youtubeAPIKey
        },
        json: true
    });
    const pollingTime = result.pollingIntervalMillis;
    const nextPageToken = result.nextPageToken;
    const comments = result.items.map(item => ({
        id: item.id,
        text: item.snippet.displayMessage,
        userId: item.authorDetails.channelId,
        username: item.authorDetails.displayName,
        avatar: item.authorDetails.profileImageUrl
    }));

    return {
        pollingTime,
        nextPageToken,
        comments
    };
}

run();

const delay = require('delay');
const request = require('request-promise');
const io = require('socket.io')(3002);

const { youtubeAccessToken } = require('./../config/secret');
const HookProcessor = require('./hookProcessor');
const hookProcessor = new HookProcessor(null, io);

var lastCommentId = null;

async function run() {
    while(true) {
        console.log('Start getting comments');
        const { pollingTime, comments } = await getLiveChat();
        const newComments = getNewComments(comments); 
        console.log(`Found ${newComments.length} new comments`);
        if (newComments.length > 0) {
            console.log(JSON.stringify(newComments, null, 2));
        }

        hookProcessor.processYoutubeComments(newComments);
        console.log(`Pool for ${pollingTime/1000}s before continue`);
        await delay(pollingTime);
    }
}

function getNewComments(allComments) {
    if (!allComments || allComments.length === 0) return [];
    
    // New page or comment id is not set
    if (allComments.every(comment => comment.id !== lastCommentId)) {
        lastCommentId = allComments[allComments.length - 1].id; 
        return allComments;  
    } else {
        const result = [];
        var processed = true;
        for (const comment of allComments) {
            if (!processed) {
                result.push(comment);
                lastCommentId = comment.id;
            }
            // Loop until found processed
            if (comment.id ===  lastCommentId) processed = false;
        }
        return result;
    }
}

async function getLiveChat() {
    const url = 'https://www.googleapis.com/youtube/v3/liveChat/messages';
    const result = await request({
        uri: url,
        headers: {
            'Authorization': 'Bearer ' + youtubeAccessToken
        },
        qs: {
            part: 'id,snippet,authorDetails',
            liveChatId: 'EiEKGFVDZFY5dG43OXYzZWNTRHBDMUFqVkthdxIFL2xpdmU',
            profileImageSize: 150,
            maxResults: 2000,
            pageToken: null
        },
        json: true
    });
    const pollingTime = result.pollingIntervalMillis;
    const comments = result.items.map(item => ({
        id: item.id,
        text: item.snippet.displayMessage,
        userId: item.authorDetails.channelId,
        username: item.authorDetails.displayName,
        avatar: item.authorDetails.profileImageUrl
    }));

    return {
        pollingTime,
        comments
    };
}

run();

const request = require('request-promise');
const delay = require('delay');
const { youtubeAccessToken } = require('./../config/secret');

async function run() {
    
    for (let index = 0; index < 200; index++) {
        const body = {
            "snippet": {
                "liveChatId": "EiEKGFVDZFY5dG43OXYzZWNTRHBDMUFqVkthdxIFL2xpdmU",
                "type": "textMessageEvent",
                "textMessageDetails": {
                    "messageText": "Hello From API " + index
                }
            }
        };

    const url = 'https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet';
    const result = await request({
        uri: url,
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + youtubeAccessToken
        },
        body,
        json: true
    });
    console.log(body);
        await delay(200);       
    }
}

run();

// @flow

const request = require('request-promise');
const { accessToken } = require('./../config/secret');

class Api {
    cache: Object;

    constructor() {
        this.cache = {};
    }

    async getAvatar(id: string): Promise < string > {
        if (this.cache[id]) return this.cache[id];

        const url = `https://graph.facebook.com/${id}/picture`;
        const result = await request({
            uri: url,
            qs: {
                redirect: false,
                type: 'normal',
                access_token: accessToken
            },
            json: true
        });

        var imgUrl = result.data.url;
        this.cache[id] = imgUrl;
        return imgUrl;
    }
}

module.exports = new Api();
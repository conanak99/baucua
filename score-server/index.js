const serverless = require('serverless-http');
const Koa = require('koa'); // or any supported framework

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World from code dao';
});
// this is it!
module.exports.handler = serverless(app);

app.listen(3000);

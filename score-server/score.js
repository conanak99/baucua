const serverless = require('serverless-http');
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const router = new Router();

const app = new Koa();
app.use(bodyParser())

router.get('/', (ctx, next) => {
  // ctx.router available
  ctx.body = {
    "hello": "world"
  }
});

router.post('/', (ctx, next) => {
  // ctx.router available
  ctx.body = ctx.request.body
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

// this is it!
module.exports.handler = serverless(app);

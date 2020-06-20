const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribersList = [];

router.get('/subscribe', async (ctx) => {
  const promise = new Promise((resolve) => {
    subscribersList.push(resolve);
  });

  ctx.body = await promise;
});

router.post('/publish', async (ctx) => {
  const message = ctx.request.body.message;
  if (message && message.length > 0) {
    subscribersList.forEach((item) => item(message));
  }
  ctx.response.status = 200;
});

app.use(router.routes());

module.exports = app;

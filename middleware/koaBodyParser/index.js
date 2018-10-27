const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const bodyParser = require("./koaBodyParser");

app.use(bodyParser());

router.get("/bodyParser", async (ctx, next) => {
    console.log(ctx.request);
    ctx.body = ctx.request.body;
});
app.use(router.routes());
app.listen(3000, () => {
    console.log("Your server is listen on port 3000");
});
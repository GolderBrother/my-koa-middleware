const Koa = require("Koa");
const app = new Koa();
const KoaRouter = require("./koaRouter");
const router = new KoaRouter();

router.get("/testRouter", async (ctx, next) => {
    ctx.body = ctx.path;
});
app.use(router.routes());

app.listen(3000, () => {
    console.log("Your server is listen on port 3000");
});




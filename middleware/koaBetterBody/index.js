const Koa = require("koa");
const app = new Koa();
const static = require("koa-static");
const path = require("path");
const koaBetterBody = require("./koaBetterBody");
const Router = require("koa-router");
const router = new Router();

// 设置静态文件访问目录，处理静态文件 =处理成绝对路径 path.resolve 防止有问题
app.use(static(path.resolve(__dirname, "./view")));

app.use(koaBetterBody());

router.post('/upload', async (ctx) => {
    console.log(ctx.request.fields);
    ctx.body = JSON.stringify(ctx.request.fields);
});
app.use(router.routes());



app.listen(3000, () => {
    console.log("Your server is listen on port 3000");
});
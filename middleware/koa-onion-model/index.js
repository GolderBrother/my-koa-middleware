const Koa = require("koa");
const app = new Koa();
const static = require("koa-static");
const path = require("path");

// 设置静态文件访问目录，处理静态文件 =处理成绝对路径 path.resolve 防止有问题
app.use(static(path.resolve(__dirname, "public")));

app.use(async (ctx, next) => {
    console.log(1);
    await next();
    console.log(2);
    ctx.body = "hello"
});

app.use(async (ctx, next) => {
    console.log(3);
    await next();
    console.log(4);
});

app.use(async (ctx, next) => {
    console.log(5);
    await next();
    console.log(6);
});

/*
    1
    3
    5
    6
    4
    2
*/
/*
    我们知道 Koa 的 use 方法是支持异步的，所以为了保证正常的按照洋葱模型的执行顺序执行代码，需要在调用 next 的时候让代码等待，
    等待异步结束后再继续向下执行，所以我们在 Koa 中都是建议使用 async/await的，引入的中间件都是在 use 方法中调用，由此我们可以分析出每一个 Koa 的中间件都是返回一个 async 函数的。

*/

app.listen(3000, () => {
    console.log(app)
    console.log("Your server is listen on port 3000")
});

// https://juejin.im/post/5bbdb732e51d450e6867c743
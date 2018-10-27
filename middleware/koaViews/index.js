const Koa = require("koa");
const views = require("koa-views");
const path = require("path");
const app = new Koa();

app.use(views(path.resolve(__dirname, "./views"), {
    extension: "ejs"
}));

// 可以看出我们使用了 koa-views 中间件后，让 ctx 上多了 render 方法帮助我们实现对模板的渲染和响应页面，
// 就和直接使用 ejs 自带的 render 方法一样，并且从用法可以看出 render 方法是异步执行的，所以需要使用 await 进行等待

app.use(async (ctx, next) => {
    await ctx.render("index", {name: "panda", age: 18, arr:[1,2,3]})
});

app.listen(3000, () => {
    console.log("Your server is listen on port 3000");
});


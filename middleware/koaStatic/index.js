const Koa = require("koa");
const app = new Koa();
const path = require("path");

const koaStatic = require("./koaStatic");

app.use(koaStatic(path.resolve(__dirname, "views")));

app.listen(3000, () => {
    console.log("Your server is listen on port 3000");
});
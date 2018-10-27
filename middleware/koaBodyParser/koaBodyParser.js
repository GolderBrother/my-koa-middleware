const querystring = require("querystring");

// 我们知道 Koa 的 use 方法是支持异步的， 所以为了保证正常的按照洋葱模型的执行顺序执行代码， 需要在调用 next 的时候让代码等待，
// 等待异步结束后再继续向下执行， 所以我们在 Koa 中都是建议使用 async /await的， 引入的中间件都是在 use 方法中调用， 由此我们可以分析出每一个 Koa 的中间件都是返回一个 async 函数的。

function bodyParser() {
    return async (ctx, next) => {
        await new Promise((resolve, reject) => {
            // 存储数据的数组
            let dataArr = [];
            // 接收数据
            ctx.req.on("data", data => dataArr.push(data));
            ctx.req.on("end", () => {
                // 整合数据并使用 Promise 返回结果
                try {
                    // 获取请求数据的类型 json 或表单
                    const contentType = ctx.get("Content-Type");
                    // 获取数据的Buffer格式
                    let data = Buffer.concat(dataArr).toString();
                    let convertData = {};
                    if (contentType === "application/x-www-form-urlencoded") {
                        convertData = querystring.parse(data)
                    } else if (contentType === "application/json") {
                        convertData = JSON.parse(data)
                    } else {
                        convertData = data;
                    }
                    ctx.request.body = convertData;
                    // 执行成功的回调
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
        // 继续向下执行 控制权交给下一个中间件
        await next();
    }
}

module.exports = bodyParser;
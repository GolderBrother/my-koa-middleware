const fs = require("fs");
const path = require("path");
const mime = require("mime");
const {
    promisify
} = require("util");

// 将 stat 和 access 转换成 Promise
const stat = promisify(fs.stat);
const access = promisify(fs.access);

function koaStatic(dir) {
    return async (ctx, next) => {
        // 将访问的路由处理成绝对路径，这里要使用 join 因为有可能是 /
        let realPath = path.join(dir, ctx.path);
        try {
            //获取stat对象
            const statObj = await stat(realPath);
            // 获取是文件还是文件夹，如果是文件，则设置文件类型并直接响应内容，否则当作文件夹寻找 index.html
            if (statObj.isFile) {
                // 获取文件类型 mime.getType(realPath)  //text/html
                ctx.set("Content-Type", `${mime.getType(realPath)};charset=utf8`);
                ctx.body = fs.createReadStream(realPath);
            } else {
                let filename = path.join(realPath, "index.html");
                // 判断文件是否存在, 如果不存在该文件则执行 catch 中的 next 交给其他中间件处理
                await access(filename);
                ctx.set("Content-Type", "text/html;charset=utf8");
                ctx.body = fs.createReadStream(filename);
            };
        } catch (error) {
            console.log(error);
            await next();
        }
    };
}

module.exports = koaStatic;
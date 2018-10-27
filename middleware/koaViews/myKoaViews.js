const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

// 将读取文件方法转换成 Promise
const readFile = promisify(fs.readFile);

function koaView(dir, options) {
    return async(ctx, next) => {
        // 动态引入模板依赖模块
        const ext = options.extension;
        const view = require(ext);
        ctx.render = async (filename, data) => {
            // 异步读取文件内容
            const temp = await readFile(path.join(dir, `${filename}.${ext}`),"utf8");
            
            // 将模板渲染并返回页面字符串
            let pageStr = view.render(temp, data);

            // 设置响应类型并响应页面
            ctx.set("Content-Type", "text/html;charset=utf8");
            console.log(pageStr);
            ctx.body = pageStr;
        };
        // 继续向下执行
        await next();
    }
}

module.exports = koaView;

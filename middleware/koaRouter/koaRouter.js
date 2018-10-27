// 控制每一个路由层的类
class Layer {
    constructor(path, cb) {
        this.path = path;
        this.cb = cb;
    }
    match(path) {
        // 地址的路由和当前配置路由相等返回 true，否则返回 false
        return this.path === path;
    }
}

// 路由的类
class Router {
    constructor() {
        // 存放每个路由对象的数组, {path:/xxx, fn:cb}
        this.layers = [];
    }

    // get请求处理函数
    get(path, cb) {
        this.layers.push(new Layer(path, cb))
    }

    compose(ctx, next, handles) {
        // 将匹配的路由函数串联执行
        function dispatch(index) {
            // 如果当前 index 个数大于了存储路由对象的长度，则执行 Koa 的 next 方法
            if (index > handles.length) return next();
            // 否则调用取出的路由对象的回调执行，并传入一个函数，在传入的函数中递归 dispatch(index + 1)
            // 目的是为了执行下一个路由对象上的回调函数
            // () => dispatch(index++) 相当于 next函数
            handles[index].cb(ctx, () => dispatch(index++));
        }
        dispatch(0);
    }

    // 路由函数，用来路由匹配到处理函数
    routes() {
        // 当前 next 是 Koa 自己的 next，即 Koa 其他的中间件
        return async (ctx, next) => {
            // 筛选出路径相同的路由
            let handles = this.layers.filter(layer => layer.match(ctx.path));
            this.compose(ctx, next, handles);
        }
    }
}

module.exports = Router;
/*
在上面我们创建了一个 Router 类，定义了 get 方法，当然还有 post 等，我们只实现 get 意思一下，
get 内为逻辑为将调用 get 方法的参数函数和路由字符串共同构建成对象存入了数组 layers，
所以我们创建了专门构造路由对象的类 Layer，方便扩展，在路由匹配时我们可以根据 ctx.path 拿到路由字符串，
并通过该路由过滤调数组中与路由不匹配的路由对象，调用 compose 方法将过滤后的数组作为参数 handlers 传入，
串行执行路由对象上的回调函数。

compose 这个方法的实现思想非常的重要，在 Koa 源码中用于串联中间件，在 React 源码中用于串联 redux 的 promise、
thunk 和 logger 等模块，我们的实现是一个简版，并没有兼容异步，主要思想是递归 dispatch 函数，每次取出数组中下一个路由对象的回调函数执行，
直到所有匹配的路由的回调函数都执行完，执行 Koa 的下一个中间件 next，注意此处的 next 不同于数组中回调函数的参数 next，
数组中路由对象回调函数的 next 代表下一个匹配路由的回调
*/
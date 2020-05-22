const Koa = require('koa')
const mongoose = require('mongoose')
const views = require('koa-views')
const { resolve } = require('path')
const { connect, initSchemas, initAdmin } = require('./database/init')
const router = require('./routes')

;(async () => {
  // 连接数据库
  await connect()

  // 初始化scama
  initSchemas()

  // 向douban-test数据库的User表中，添加admin用户数据
  await initAdmin()

  // 由于豆瓣对网站爬取次数的限制，在数据库中有数据时，不要开启以下代码的执行，以下代码是爬取电影数据，存到mongodb中
  // 爬取电影数据
  // require('./tasks/movie')
  // // 对爬取的数据组装？
  // require('./tasks/api')
  // // 爬取电影视频
  // require('./tasks/trailer')
  // // 对爬取的数据上传到七牛，，如果不考虑云服务，这一步可以不用执行
  // require('./tasks/qiniu')
})()

const app = new Koa()

app
  .use(router.routes())
  .use(router.allowedMethods())

  //通过 koa-views 框架，在ctx中集成render方法,以便之后使用，并且制定了渲染模板为pug，
  // 渲染模板html在 ./views目录下，指定目录后，ctx.render('index'，将表示启用./views/index模板
app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

// 一旦有路由申请，将直接被捕获，然后渲染页面
app.use(async (ctx, next) => {
  // 启用./views/index模板
  await ctx.render('index', {
    you: 'Luke',
    me: 'Scott'
  })
})

app.listen(4455)
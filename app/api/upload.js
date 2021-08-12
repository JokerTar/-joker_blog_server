const path = require('path')
const Router = require('koa-router')
const router = new Router({
    prefix: '/upload'
})
const {Auth} = require('@mid/auth')

router.post('/', async (ctx, next) => {
    const file = ctx.request.files.file
    // path.basename(绝对路径)生成文件名称加后缀名称 test.jpg
    const basename = path.basename(file.path)
    
    ctx.body = {
        file: {
            // path: `${ctx.origin}/upload/${basename}` // http://localhost:3000/upload/test.jpg
            path: `https://www.beelz.cn/api/upload/${basename}` // http://localhost:3000/upload/test.jpg
        },
        code: 200
    }
})

module.exports = router
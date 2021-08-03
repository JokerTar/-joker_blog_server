const Router = require('koa-router')
const {Blog} = require('@module/blog')
const {BlogValidator, DeleteValidator, SearchValidator} = require('@validator')
const {Auth} = require('@mid/auth')

const router = new Router({
    prefix: '/blog'
})


router.post('/list', async (ctx, next) => {
    const v = await new SearchValidator().validate(ctx)

    const r = await Blog.fetchList(v.get('body'))

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/view', async (ctx, next) => {
    const {bid, uid} = ctx.request.body
    const r = await Blog.view(bid, uid)

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/new',new Auth().validateToken(), async (ctx, next) => {
    const {uid} = ctx.auth
    const v = await new BlogValidator().validate(ctx)

    const r = await Blog.addBlog(v.get('body'), uid)

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/delete',new Auth().validateToken(), async (ctx, next) => {
    const {uid} = ctx.auth
    const v = await new DeleteValidator().validate(ctx)

    const r = await Blog.deleteBlog(v.get('body.id'), uid)

    ctx.body = {
        data: r,
        code: 200
    }
})

module.exports = router
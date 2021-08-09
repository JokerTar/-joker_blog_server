const Router = require('koa-router')
const router = new Router({
    prefix: '/column'
})
const {Auth} = require('@mid/auth')
const {ColumnValidator, SearchValidator, DeleteValidator} = require('@validator')
const {Column} = require('@module/column')
const {ColumnManager} = require('@module/columnManager')

router.post('/add', new Auth().validateToken(), async (ctx, next) => {
    const v = await new ColumnValidator().validate(ctx)

    const r = await Column.addColumn(v.get('body'), v.get('auth.uid'))

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/delete', new Auth().validateToken(), async (ctx, next) => {
    const v = await new DeleteValidator().validate(ctx)

    const r = await Column.delete(v.get('body'), v.get('auth.uid'))

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/list', async (ctx, next) => {
    const {uid} = ctx.request.body
    const r = await Column.fetchColumn(uid)

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/blog', new Auth().validateToken(), async (ctx, next) => {
    const v = await new SearchValidator().validate(ctx)

    const r = await Column.fetchBlog(v.get('body'))

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/manager/add', new Auth().validateToken(), async (ctx, next) => {
    // const v = await new ColumnValidator().validate(ctx)

    const r = await ColumnManager.add(ctx.request.body, ctx.auth.uid)

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/manager/delete', new Auth().validateToken(), async (ctx, next) => {
    // const v = await new DeleteValidator().validate(ctx)

    const r = await ColumnManager.delete(ctx.request.body, ctx.auth.uid)

    ctx.body = {
        data: r,
        code: 200
    }
})

module.exports = router
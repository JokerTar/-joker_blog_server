const Router = require('koa-router')
const router = new Router({
    prefix: '/comment'
})
const {Comment} = require('@module/comment')
const {SearchValidator, CommentValidator, DeleteValidator} = require('@validator')
const {Auth} = require('@mid/auth')

router.post('/list', async (ctx, next) => {
    const v = await new SearchValidator().validate(ctx)
    const result = await Comment.fetchComment(v.get('body'), v.get('auth.uid'))

    ctx.body = {
        data: result,
        code: 200
    }
})

router.post('/new', new Auth().validateToken(), async (ctx, next) => {
    const v = await new CommentValidator().validate(ctx)
    const r = await Comment.addComment(v.get('body'), v.get('auth.uid'))

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/delete',new Auth().validateToken(), async (ctx, next) => {
    const {uid} = ctx.auth
    const v = await new DeleteValidator().validate(ctx)

    const r = await Comment.deleteComment(v.get('body.id'), uid)

    ctx.body = {
        data: r,
        code: 200
    }
})

module.exports = router
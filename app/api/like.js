const Router = require('koa-router')
const router = new Router({
    prefix: '/like'
})
const {Auth} = require('@mid/auth')
const {LikeValidator, UnlikeValidator} = require('@validator')
const {Like} = require('@module/like')

router.post('/save', new Auth().validateToken(), async (ctx, next) => {
    const v = await new LikeValidator().validate(ctx)

    const r = await Like.praise(v.get('body'), v.get('auth.uid'))

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/cancel', new Auth().validateToken(), async (ctx, next) => {
    const v = await new UnlikeValidator().validate(ctx)

    const r = await Like.unpraise(v.get('body'), v.get('auth.uid'))

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/islike', new Auth().validateToken(), async (ctx, next) => {
    const v = await new LikeValidator().validate(ctx)

    const r = await Like.praise(v.get('body'))

    ctx.body = {
        data: r,
        code: 200
    }
})

module.exports = router
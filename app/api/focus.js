const Router = require('koa-router')
const router = new Router({
    prefix: '/focus'
})

const {Auth} = require('@mid/auth')
const {Focus} = require('@module/focus')
const {ColumnValidator, SearchValidator, DeleteValidator} = require('@validator')


router.post('/save', new Auth().validateToken(), async (ctx, next) => {
    const v = await new DeleteValidator().validate(ctx)
    await Focus.focus(v.get('body.id'), ctx.auth.uid)

    ctx.body = {
        code: 200
    }
})

router.post('/cancel', new Auth().validateToken(), async (ctx, next) => {
    const v = await new DeleteValidator().validate(ctx)
    await Focus.unfocus(v.get('body.id'), ctx.auth.uid)

    ctx.body = {
        code: 200
    }
})

router.post('/list', new Auth().validateToken(), async (ctx, next) => {
    const v = await new SearchValidator().validate(ctx)
    const r = await Focus.fetchFocus(v.get('body'), ctx.auth.uid)

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/focusUser', async (ctx, next) => {
    const v = await new SearchValidator().validate(ctx)
    const r = await Focus.fetchFocusUser(v.get('body'))

    ctx.body = {
        data: r,
        code: 200
    }
})

module.exports = router
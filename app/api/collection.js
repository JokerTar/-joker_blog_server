const Router = require('koa-router')
const router = new Router({
    prefix: '/collection'
})
const {Auth} = require('@mid/auth')
const {CollectionValidator, SearchValidator} = require('@validator')
const {Collection} = require('@module/collection')

router.post('/save', new Auth().validateToken(), async (ctx, next) => {
    const v = await new CollectionValidator().validate(ctx)

    const r = await Collection.add(v.get('body.bid'), v.get('auth.uid'))

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/cancel', new Auth().validateToken(), async (ctx, next) => {
    const v = await new CollectionValidator().validate(ctx)

    const r = await Collection.delete(v.get('body.bid'), v.get('auth.uid'))

    ctx.body = {
        data: r,
        code: 200
    }
})

router.post('/list', async (ctx, next) => {
    const v = await new SearchValidator().validate(ctx)

    const r = await Collection.fetchCollectionBlog(v.get('body'))

    ctx.body = {
        data: r,
        code: 200
    }
})

module.exports = router
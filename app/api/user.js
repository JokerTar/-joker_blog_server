const Router = require('koa-router')
const router = new Router({
    prefix: '/user'
})

const {User} = require('@module/user')
const {Auth} = require('@mid/auth')
const {UpdateUserValidator} = require('@validator')

router.post('/register', async (ctx, next) => {
    const {email, password, nikename} = ctx.request.body

    await User.create({
        email, password, nikename,
        avatar: `${ctx.origin}/default/avatar.png`
    })

    ctx.body = {
        code: 200,
        ok: true
    }
})

router.post('/info', new Auth().validateToken(), async (ctx, next) => {
    const {uid} = ctx.auth
    const r = await User.findOne({
        where: {
            id: uid
        },
        attributes: {
            exclude: ['password', 'created_time', 'updated_time', 'deleted_time']
        }
    })

    ctx.body = {
        data: r,
        ok: true,
        code: 200
    }
})

router.post('/auth', async (ctx, next) => {
    const {id} = ctx.request.body
    const r = await User.findOne({
        where: {
            id
        },
        attributes: {
            exclude: ['password', 'created_time', 'updated_time', 'deleted_time']
        }
    })

    ctx.body = {
        data: r,
        ok: true,
        code: 200
    }
})

router.post('/update', new Auth().validateToken(), async (ctx, next) => {

    const v = await new UpdateUserValidator().validate(ctx)
    await User.updateUser(v.get('body'), v.get('auth.uid'))

    ctx.body = {
        code: 200,
        ok: true
    }
})

module.exports = router
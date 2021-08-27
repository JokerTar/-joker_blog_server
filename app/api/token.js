const Router = require('koa-router')
const router = new Router({
    prefix: '/token'
})

const {User} = require('@module/user')
const {TokenValidator} = require('@validator')
const {generateToken} = require('@core/utils')
const {WXManger} = require('@/app/services/wx')

router.post('/', async (ctx, next) => {
    const v = await new TokenValidator().validate(ctx)

    let token = await emailLogin(v.get('body.email'), v.get('body.password'))

    // const token = await emailLogin(v.get('body.email'), v.get('body.password'))

    ctx.body = {
        data: {
            token
        },
        code: 200,
        ok: true
    }
})

router.post('/wx', async (ctx, next) => {
    let token
    const param = ctx.request.body

    if (param.type === 200) {
        token = await WXManger.codeToToken(param)
    } else {
        return
    }

    ctx.body = {
        data: {
            token
        },
        code: 200,
        ok: true
    }
})

async function emailLogin(email, password) {
    const user = await User.verifyEmailPassword(email, password)
    return generateToken(user.id)
}

module.exports = router
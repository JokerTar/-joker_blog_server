const { ApiEcception } = require('../core/api-exception')
const {environment} = require('../config/config')

const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        if (environment === 'dev' && !error instanceof ApiEcception) {
            throw error
        }

        if (error instanceof ApiEcception) {
            ctx.body = {
                msg: error.msg,
                error_code: error.errorCode,
                request: `${ctx.method} ${ctx.path}`
            },
            ctx.status = error.code
        } else {
            ctx.body = {
                msg: '未知异常！！！',
                error_code: 9999,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500
            throw error
        }
    }
}

module.exports = catchError
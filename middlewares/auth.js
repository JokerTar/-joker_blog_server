const jwt = require('jsonwebtoken')
const {secretKey, expiresIn} = require('../config/config').security
const {Forbbiden} = require('../core/api-exception')

class Auth {
    validateToken() {
        return async (ctx, next) => {
            const header = ctx.request.header
            const token = header.token
            let msg = 'token不合法'
            let decode

            if (!token) throw new Forbbiden(msg)

            try {
                decode = jwt.verify(token, secretKey)
            } catch (error) {
                if (token == 'TokenExpiredError') msg = 'token已过期'
                throw new Forbbiden(msg)
            }

            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            }

            await next()
        }
    }

    getToken() {
        return async (ctx, next) => {
            const header = ctx.request.header
            const token = header.token
            let decode
            if (token) {
                decode = jwt.verify(token, secretKey)
            } else {
                decode  ={}
            }
            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            }

            await next()
        }
    }
}

module.exports = {
    Auth
}
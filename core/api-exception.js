class ApiEcception extends Error{
    constructor(msg, errorCode, code) {
        super()

        this.msg = msg || '服务器错误'
        this.errorCode = errorCode
        this.code = code
    }
}

class ParameterException extends ApiEcception{
    constructor(msg, errorCode) {
        super()

        this.msg = msg || '参数错误'
        this.errorCode = errorCode || 10001
        this.code = 400
    }
}

class NotFound extends ApiEcception{
    constructor(msg, errorCode) {
        super()

        this.msg = msg || '资源未找到'
        this.errorCode = errorCode || 10004
        this.code = 404
    }
}

class AuthFailed extends ApiEcception{
    constructor(msg, errorCode) {
        super()

        this.msg = msg || '授权失败'
        this.errorCode = errorCode || 10005
        this.code = 403
    }
}

class Forbbiden extends ApiEcception{
    constructor(msg, errorCode) {
        super()

        this.msg = msg || '禁止访问'
        this.errorCode = errorCode || 10006
        this.code = 401
    }
}

class FocusError extends ApiEcception{
    constructor(msg, errorCode) {
        super()

        this.msg = msg || '已关注'
        this.errorCode = errorCode || 10008
        this.code = 305
    }
}

class CollectionError extends ApiEcception{
    constructor(msg, errorCode) {
        super()

        this.msg = msg || '已收藏'
        this.errorCode = errorCode || 10009
        this.code = 306
    }
}

module.exports = {
    ApiEcception,
    ParameterException,
    NotFound,
    AuthFailed,
    Forbbiden,
    FocusError,
    CollectionError
}
const util = require('util')
const axios = require('axios')
const {appId, appSecret, loginUrl} = require('@/config/config').wx
const {AuthFailed} = require('@core/api-exception')
const {User} = require('@module/user')
const {generateToken} = require('@core/utils')

class WXManger{
    static async codeToToken(param) {
        const {code} = param
        const url = util.format(loginUrl, appId, appSecret, code)

        const result = await axios.get(url)

        if (result.status !== 200) {
            throw new AuthFailed('openid获取失败')
        }

        const errcode = result.data.errcode
        const openid = result.data.openid
        
        if (errcode) {
            throw new AuthFailed('openid获取失败:' + errcode)
        }

        // openid
        // user表没有openid 使用openid注册
        let user = await User.getUserByOpenid(openid)

        if (!user) {
            user = await User.registerUserByOpenid({
                ...param,
                openid
            })
        }

        return generateToken(user.id, 2)
    }
}

module.exports = {
    WXManger
}
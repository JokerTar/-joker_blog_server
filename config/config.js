module.exports = {
    environment: 'dev',
    database: {
        dbName: 'beelz',
        user: 'root',
        password: 'TT12345678',
        host: '8.136.209.34',
        // password: '12345678',
        // host: 'localhost',
        port: 3306
    },
    security: {
        secretKey: 'justtar23098^&!@',
        expiresIn: 60*60*6
    },
    wx: {
        appId: 'wxcafd9336c5ac01c5',
        appSecret: 'b5575c83229975a989839fd0739cdc79',
        loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    }
}
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
    }
}
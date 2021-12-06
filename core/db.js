const Sequelize = require('sequelize')
const {dbName, user, password, host, port} = require('@/config/config').database

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    timezone: '+08:00',
    define: {
        timestamps: true,
        paranoid: true,
        createdAt: 'created_time',
        updatedAt: 'updated_time',
        deletedAt: 'deleted_time',
        underscored: true, // 驼峰转下划线
        underscoredAll: true
    }
})

sequelize.sync({
    // force: true, // 删除表 重新生成
})

module.exports = {
    sequelize
}
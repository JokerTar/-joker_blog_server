const {Sequelize, Model} = require('sequelize')
const {sequelize} = require('@core/db')
const {NotFound, AuthFailed} = require('@/core/api-exception')
const bcrypt = require('bcryptjs')

class User extends Model {
    static async verifyEmailPassword(email, password) {
        const user = await User.findOne({
            where: {
                email
            }
        })

        if (!user) throw new NotFound('账号不存在')

        const correct = bcrypt.compareSync(password, user.password)
        if (!correct) throw new AuthFailed('密码错误')

        return user
    }
}

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    avatar: Sequelize.STRING,
    memberCover: Sequelize.STRING,
    nikename: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        set(val) {
            const salt = bcrypt.genSaltSync(10)
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue('password', psw)
        }
    },
    gender: Sequelize.STRING,
    signature: Sequelize.STRING,
    address1: Sequelize.STRING,
    address2: Sequelize.STRING,
    tag: Sequelize.STRING,
    introduction: Sequelize.STRING,
    qq: Sequelize.STRING,
    wx: Sequelize.STRING,
    blogNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize: sequelize,
    tableName: 'user'
})

module.exports = {
    User
}
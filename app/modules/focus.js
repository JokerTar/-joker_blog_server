const { Sequelize, Model, Op } = require('sequelize')
const {sequelize} = require('@core/db')

class Focus extends Model {
    static async focus(bid, uid) {
        const r = await Focus.findOne({
            bid,
            uid
        })
        if (r) {
            throw new Error('已添加关注')
        }
        const v = await Focus.create({
            bid,
            uid
        })

        return v
    }

    static async unfocus(bid, uid) {
        const v = await Focus.destroy({
            where: {
                bid, uid
            },
            force: true
        })

        return v
    }

    static async fetchFocus(param = {}, uid) {
        const {bid, page, currentPage} = param
        const r = await Focus.findAndCountAll({
            where: {
                bid,
                uid
            },
            limit: currentPage, // 每页多少条
            offset: (page - 1) * currentPage // 跳过多少条
        })

        const list = r.rows || []

        return {
            result: list,
            page,
            currentPage,
            total: r.count
        }
    }

    static async fetchFocusUser(param = {}) {
        const {User} = require('@module/user')
        const {uid} = param

        const {page, currentPage} = param
        const f = await Focus.findAll({
            where: {
                uid
            }
        })

        const uids = f.map(item => item.bid)

        const u = await User.findAndCountAll({
            where: {
                id: {
                    [Op.in]: uids
                }
            },
            attributes: {
                exclude: ['password', 'created_time', 'updated_time', 'deleted_time']
            },
            limit: currentPage, // 每页多少条
            offset: (page - 1) * currentPage // 跳过多少条
        })

        const list = u.rows || []

        return {
            result: list,
            page,
            currentPage,
            total: u.count
        }
    }
}

Focus.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uid: Sequelize.INTEGER,
    bid: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'Focus'
})

module.exports = {
    Focus
}
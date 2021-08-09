const {Sequelize, Model} = require('sequelize')
const {sequelize} = require('@core/db')
const {User} = require('@module/user')
const {columnManager} = require('@module/columnManager')

class Column extends Model{
    static async addColumn(param = {}, uid) {
        return sequelize.transaction(async t => {
            await Column.create({
                ...param,
                uid
            }, {transaction: t})

            await User.increment('column_number', {by: 1, where: {id: uid}, transaction: t})
        })
    }

    static async delete(param = {}, uid) {
        const {id} = param
        return sequelize.transaction(async t => {
            await Column.destroy({
                where: {
                    ...param,
                    uid
                },
                force: true
            }, {transaction: t})

            await User.decrement('column_number', {by: 1, where: {id: uid}, transaction: t})

            await columnManager.destroy({
                where: {
                    cid: id
                }
            })
        })
    }

    static async fetchColumn(uid) {
        const  r = Column.findAll({
            where: {
                uid
            }
        })

        return r
    }

    static async fetchBlog(param = {}) {
        const {Blog} = require('@module/blog')

        const { uid } = param
        const c = await Column.findAll({
            where: {
                uid
            }
        })

        let cids = c.map(item => item.id)

        if (cids && !cids.length) return []

        const params = {
            ...param,
            cids
        }

        const result = await Blog.fetchList(params)
        return result
    }
}

Column.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: Sequelize.INTEGER,
    title: Sequelize.STRING,
    introduce: Sequelize.STRING,
    cover: Sequelize.STRING
}, {
    sequelize: sequelize,
    tableName: 'column'
})

module.exports = {
    Column
}
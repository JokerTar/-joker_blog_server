const {Sequelize, Model} = require('sequelize')
const {sequelize} = require('@core/db')
const {User} = require('@module/user')
const {ColumnManager} = require('@module/columnManager')

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

    static async updateColumn(param = {}, uid) {
        const {id} = param
        const v = await Column.update({
            ...param,
            uid
        }, {
            where: {
                id
            }
        })

        return v
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

            await ColumnManager.destroy({
                where: {
                    cid: id
                },
                force: true
            }, {transaction: t})
        })
    }

    static async fetchColumnList(param = {}, uid) {
        const {page, currentPage, order, keyWord} = param
        let search = {}
        if (uid) search = { uid }
        const  r = await Column.findAndCountAll({
            where: {
                ...search
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

    static async fetchColumnInfo(id) {
        const {User} = require('@module/user')
        const  r = await Column.findOne({
            where: {
                id
            }
        })

        const {uid} = r
        let u = {}
        if (uid) {
            u = await User.findOne({
                where: {
                    id: uid
                },
                attributes: {
                    exclude: ['password', 'created_time', 'updated_time', 'deleted_time']
                }
            })
        }

        return {
            ...r.dataValues,
            auth_info: u.dataValues
        }
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
    cover: Sequelize.STRING,
    blogNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize: sequelize,
    tableName: 'column'
})

module.exports = {
    Column
}
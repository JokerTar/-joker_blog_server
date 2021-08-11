const {Sequelize, Model, Op} = require('sequelize')
const {sequelize} = require('@core/db')
const {User} = require('@module/user')

class ColumnManager extends Model{
    static async add( {ids = []} , uid) {
        const {Column} = require('@module/column')

        const r = ids.map(item => {
            return {
                ...item,
                uid
            }
        })

        const bids = ids.map(item => item.bid)
        const cid = ids.map(item => item.cid)[0]

        return sequelize.transaction(async t => {
            await ColumnManager.destroy({
                where: {
                    // bid: {
                    //     [Op.in]: bids
                    // },
                    cid
                },
                force: true
            }, {transaction: t})
            const v = await ColumnManager.bulkCreate(r, {transaction: t})
            await Column.increment('blog_number', {by: bids.length, where: {id: cid}, transaction: t})
    
            return v
        })
    }

    static async delete(list = []) {
        const v = ColumnManager.destroy({
            where: {
                id: {
                    [Op.in]: list
                }
            },
            force: true
        })

        return v
    }

    static async fetchBlog(param = {}) {
        const {Blog} = require('@module/blog')
        const {cid, page, currentPage} = param
        
        const r = await ColumnManager.findAll({
            where: {
                cid
            }
        })

        const bids = r.map(item => item.bid)
        const search = {
            bids,
            ...param
        }

        if (!bids || !bids.length) {
            return {
                result: [],
                page,
                currentPage,
                total: 0
            }
        }

        const v = await Blog.fetchList(search)

        return v
    }
}

ColumnManager.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cid: Sequelize.INTEGER,
    bid: Sequelize.INTEGER,
    uid: Sequelize.INTEGER
}, {
    sequelize: sequelize,
    tableName: 'columnmanager'
})

module.exports = {
    ColumnManager
}
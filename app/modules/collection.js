const { Sequelize, Model, Op } = require('sequelize')
const {sequelize} = require('@core/db')
const {Blog} = require('@module/blog')

class Collection extends Model {
    static async add(bid, uid) {
        sequelize.transaction(async t => {
            await Collection.create({
                bid,
                uid
            })

            await Blog.increment('collection_number', {by: 1, where: {id: bid}, transaction: t})
        })
    }

    static async delete(bid, uid) {
        sequelize.transaction(async t => {
            await Collection.destroy({
                where: {
                    bid,
                    uid
                },
                force: true
            })

            await Blog.decrement('collection_number', {by: 1, where: {id: bid}, transaction: t})
        })
    }

    static async fetchCollectionBlog(param = {}) {
        const { uid, page, currentPage, } = param
        const c = await Collection.findAll({
            where: {
                uid
            }
        })

        let bids = c.map(item => item.bid)

        if (bids && !bids.length) return {
            result: [],
            page,
            currentPage,
            total: 0
        }

        const params = {
            ...param,
            bids
        }

        const result = await Blog.fetchList(params)
        return result
    }
}

Collection.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uid: Sequelize.INTEGER,
    bid: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'Collection'
})

module.exports = {
    Collection
}
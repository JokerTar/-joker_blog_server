const { Sequelize, Model, Op } = require('sequelize')
const {sequelize} = require('@core/db')
const {Blog} = require('@module/blog')
const {Comment} = require('@module/comment')

class Like extends Model {
    static async praise(bid, uid, type) {
        sequelize.transaction(async t => {
            await Like.create({
                bid,
                uid,
                type
            })

            if (type === 100) await Blog.increment('like_number', {by: 1, where: {id: bid}, transaction: t})
            if (type === 200) await Comment.increment('praise_number', {by: 1, where: {id: bid}, transaction: t})
        })
    }

    static async fetchLikeBlog(param = {}) {
        const c = await Like.findAll({
            where: {
                uid,
                type: 100
            }
        })

        let bids = c.map(item => item.bid)

        const params = {
            ...param,
            bids
        }

        const result = await blog.fetchList(params)
        return result
    }
}

Like.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uid: Sequelize.INTEGER,
    bid: Sequelize.INTEGER,
    type: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'Like'
})

module.exports = {
    Like
}
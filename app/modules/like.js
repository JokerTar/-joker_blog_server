const { Sequelize, Model, Op } = require('sequelize')
const {sequelize} = require('@core/db')
const {Comment} = require('@module/comment')

class Like extends Model {
    static async praise({bid, type}, uid) {
        /**
         * type
         * 100 文章
         * 200 评论
         */
        const {Blog} = require('@module/blog')
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

    static async unpraise({bid, type}, uid) {
        /**
         * type
         * 100 文章
         * 200 评论
         */
        const {Blog} = require('@module/blog')
        sequelize.transaction(async t => {
            await Like.destroy({
                where: {
                    bid,
                    uid
                },
                force: true
            })

            if (type === 100) await Blog.decrement('like_number', {by: 1, where: {id: bid}, transaction: t})
            if (type === 200) await Comment.decrement('praise_number', {by: 1, where: {id: bid}, transaction: t})
        })
    }

    static async fetchLike(bid, uid, type) {
        const r = await Like.findOne({
            where: {
                bid,
                uid,
                type
            }
        })

        return r
    }

    static async fetchLikeBlog(param = {}) {
        const {Blog} = require('@module/blog')
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

        const result = await Blog.fetchList(params)
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

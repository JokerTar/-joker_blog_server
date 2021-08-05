const { Sequelize, Model, Op } = require('sequelize')
const {sequelize} = require('@core/db')
const {Blog} = require('@module/blog')
const {Like} = require('@module/like')
const {User} = require('@module/user')
const {listToTree} = require('@/core/utils')

class Comment extends Model {
    static async addComment(param = {}, uid) {
        const {rootid} = param
        sequelize.transaction(async t => {
            await Comment.create({
                ...param,
                uid
            })

            await Blog.increment('comments_number', {by: 1, where: {id: rootid}, transaction: t})
        })
    }

    static async deleteComment(id) {
        const r = await Comment.update({
            content: '评论已删除'
        }, {
            where: {
                id
            }
        })

        return r
    }

    static async fetchComment(param = {}, uid) {
        const {page, currentPage, bid} = param
        let search = {}
        if (uid) search = {uid}
        const r = await Comment.findAndCountAll({
            where: {
                bid
            },
            limit: currentPage,
            offset: (page - 1) * currentPage
        })

        const list = r.rows || []

        const praiseIds = [], uids = [], replyid = []
        list.forEach(item => {
            if (item.uid === uid) praiseIds.push(item.id)
            uids.push(item.uid)
            replyid.push(item.replyid)
        })

        const l = await Like.findAll({
            where: {
                id: {
                    [Op.in]: praiseIds
                }
            }
        })

        const u = await User.findAll({
            where: {
                id: {
                    [Op.in]: [...uids, ...replyid]
                }
            },
            attributes: ['id', 'nikename', 'avatar'],
        })

        const data = list.map(elememt => {
            const item = elememt.dataValues
            let flag = false, auth_info = {}, reply_info = {}
            l.forEach(sitem => {
                if (sitem.bid === item.id) flag = true
            })
            u.forEach(sitem => {
                if (sitem.id === item.uid) {
                    auth_info = sitem
                }

                if (sitem.id === item.replyid) {
                    reply_info = sitem
                }
            })
            return {
                ...item,
                is_praise: flag,
                auth_info,
                reply_info
            }
        })

        const result = listToTree(null, data,  { id: 'id', rootid: 'rootid', child: 'replies' })

        return {
            page,
            currentPage,
            total: r.count,
            data: result
        }
    }
}

Comment.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uid: Sequelize.INTEGER,
    bid: Sequelize.INTEGER,
    replyid: Sequelize.INTEGER,
    rootid: Sequelize.INTEGER,
    content: Sequelize.STRING,
    praiseNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'Comment'
})

module.exports = {
    Comment
}
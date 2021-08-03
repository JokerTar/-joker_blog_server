const {Sequelize, Model, Op} = require('sequelize')
const {sequelize} = require('@core/db')
const {User} = require('@module/user')

class Blog extends Model {
    static async addBlog(param, uid) {
        return sequelize.transaction(async (t) => {
            const r = await Blog.create({
                ...param,
                uid
            }, {transaction: t})
            await User.increment('blog_number', {by: 1, where:{id: uid},transaction: t })

            return r
        })
    }

    static async deleteBlog(bid, uid) {
        return sequelize.transaction(async (t) => {
            const r = await Blog.destroy({
                where: {
                    id: bid
                }
            }, {transaction: t})
            await User.decrement('blog_number', {by: 1, where:{id: uid},transaction: t })

            return r
        })
    }

    static async view(bid, uid) {
        return sequelize.transaction(async t => {
            const v = await Blog.findOne({
                where: {
                    id: bid
                }
            })

            await Blog.increment('view_number', {by: 1, where: {id: bid}, transaction: t})

            const u = await User.findOne({
                where: {
                    id: uid
                },
                attributes: {
                    exclude: ['deleted_time', 'password', 'created_time', 'updated_time']
                }
            })

            return {
                auth_info: u,
                article_info: v
            }
        })
    }

    static async fetchList(param = {}) {
        const {page, currentPage, keyWord, uid, order} = param
        let serachObj = {}
        let orderBy = ['created_time', 'DESC']
        if (uid) serachObj = {uid}

        const r = await Blog.findAndCountAll({
            where: {
                ...serachObj
            },
            order: [orderBy],
            // attributes: ['content', 'deleted_time'],
            limit: currentPage, // 每页多少条
            offset: (page - 1) * currentPage // 跳过多少条
        })

        const list = r.rows || []

        const ids = []
        list.forEach(item => {
            if (item.uid && !ids.includes(item.uid)) ids.push(item.uid)
        })

        const u = await User.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            },
            attributes: ['id', 'nikename', 'avatar', 'blog_number'],
        })

        const result = list.map(item => {
            let user = {}
            u.forEach(sitem => {
                if (sitem.id === item.uid) user = sitem
            })

            let brief_content
            if (item.dataValues && item.dataValues.content) {
                brief_content = item.dataValues.content.slice(0, 99)
            }

            return {
                ...item.dataValues,
                content: brief_content,
                auth_info: user
            }
        })

        return {
            result,
            page,
            currentPage,
            total: r.count
        }
    }
}

Blog.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uid: Sequelize.INTEGER,
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
    pageUrl: Sequelize.STRING,
    viewNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    likeNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    commentsNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
},{
    sequelize,
    tableName: 'blog'
})

module.exports = {
    Blog
}
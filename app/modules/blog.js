const {Sequelize, Model} = require('sequelize')
const {sequelize} = require('@core/db')
const {User} = require('@module/user')

class Blog extends Model {
    static async addBlog() {
        return sequelize.transaction(async (t) => {
            await Blog.create({}, {transaction: t})
            await User.increment('blog_number', {by: 1, where:{id: ''},transaction: t })
        })
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
    content: Sequelize.STRING,
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
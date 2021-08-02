const { Sequelize, Model } = require('sequelize')
const {sequelize} = require('@core/db')

class Comment extends Model {

}

Comment.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uid: Sequelize.INTEGER,
    rootid: Sequelize.INTEGER,
    content: Sequelize.STRING,
    isPraise: {
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
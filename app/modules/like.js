const { Sequelize, Model } = require('sequelize')
const {sequelize} = require('@core/db')

class Like extends Model {

}

Like.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uid: Sequelize.INTEGER,
    bid: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'Like'
})

module.exports = {
    Like
}
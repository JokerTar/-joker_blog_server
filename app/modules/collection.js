const { Sequelize, Model } = require('sequelize')
const {sequelize} = require('@core/db')

class Collection extends Model {

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
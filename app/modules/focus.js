const { Sequelize, Model } = require('sequelize')
const {sequelize} = require('@core/db')

class Focus extends Model {

}

Focus.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uid: Sequelize.INTEGER,
    bid: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'Focus'
})

module.exports = {
    Focus
}
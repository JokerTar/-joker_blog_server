const {Sequelize, Model, Op} = require('sequelize')
const {sequelize} = require('@core/db')
const {User} = require('@module/user')

class ColumnManager extends Model{
    static async add( {ids = []} , uid) {
        const r = ids.map(item => {
            return {
                ...item,
                uid
            }
        })
        const v = await ColumnManager.bulkCreate(r)

        return v
    }

    static async delete(list = []) {
        const v = ColumnManager.destroy({
            where: {
                id: {
                    [Op.in]: list
                }
            },
            force: true
        })

        return v
    }
}

ColumnManager.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cid: Sequelize.INTEGER,
    bid: Sequelize.INTEGER
}, {
    sequelize: sequelize,
    tableName: 'columnmanager'
})

module.exports = {
    ColumnManager
}
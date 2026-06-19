import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Notificacao = sequelize.define('Notificacao', {
    id_notificacao:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    utilizador_id:   { type: DataTypes.INTEGER, allowNull: false },
    titulo:          { type: DataTypes.STRING, allowNull: false },
    mensagem:        { type: DataTypes.TEXT, allowNull: false },
    lida:            { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at:      { type: DataTypes.DATE }
}, { tableName: 'notificacao', timestamps: false })

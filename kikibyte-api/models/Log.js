import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Log = sequelize.define('Log', {
    id_log:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    utilizador_id:{ type: DataTypes.INTEGER },
    email:        { type: DataTypes.STRING },
    role_id:      { type: DataTypes.INTEGER },
    acao:         { type: DataTypes.STRING, allowNull: false },
    recurso:      { type: DataTypes.STRING },
    recurso_id:   { type: DataTypes.INTEGER },
    detalhes:     { type: DataTypes.TEXT },
    ip:           { type: DataTypes.STRING },
    created_at:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'log', timestamps: false })

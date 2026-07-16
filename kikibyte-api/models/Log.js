import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Log = sequelize.define('Log', {
    id_log:       { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    utilizador_id:{ type: DataTypes.BIGINT },
    cliente_id:   { type: DataTypes.BIGINT },
    acao:         { type: DataTypes.STRING, allowNull: false },
    entidade:     { type: DataTypes.STRING, allowNull: false },
    entidade_id:  { type: DataTypes.BIGINT },
    ip_origem:    { type: DataTypes.STRING },
    user_agent:   { type: DataTypes.TEXT },
    antes:        { type: DataTypes.JSONB },
    depois:       { type: DataTypes.JSONB },
    created_at:   { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'log_atividade', timestamps: false })

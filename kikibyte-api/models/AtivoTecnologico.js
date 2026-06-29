import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const AtivoTecnologico = sequelize.define('AtivoTecnologico', {
    id_ativo:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente_id:     { type: DataTypes.INTEGER, allowNull: false },
    nome:           { type: DataTypes.STRING, allowNull: false },
    tipo:           { type: DataTypes.STRING },
    descricao:      { type: DataTypes.TEXT },
    quantidade:     { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at:     { type: DataTypes.DATE }
}, { tableName: 'ativo_tecnologico', timestamps: false })

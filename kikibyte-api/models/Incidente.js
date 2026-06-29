import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Incidente = sequelize.define('Incidente', {
    id_incidente:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente_id:     { type: DataTypes.INTEGER, allowNull: false },
    titulo:         { type: DataTypes.STRING, allowNull: false },
    descricao:      { type: DataTypes.TEXT },
    gravidade:      { type: DataTypes.STRING },
    estado:         { type: DataTypes.STRING, defaultValue: 'aberto' },
    data_ocorrencia:{ type: DataTypes.DATE },
    data_resolucao: { type: DataTypes.DATE },
    criado_por:     { type: DataTypes.INTEGER },
    created_at:     { type: DataTypes.DATE }
}, { tableName: 'incidente', timestamps: false })

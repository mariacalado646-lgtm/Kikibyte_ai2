import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Relatorio = sequelize.define('Relatorio', {
    id_relatorio:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente_id:      { type: DataTypes.INTEGER, allowNull: false },
    pedido_id:       { type: DataTypes.INTEGER },
    criado_por:      { type: DataTypes.INTEGER },
    titulo:          { type: DataTypes.STRING, allowNull: false },
    tipo_relatorio:  { type: DataTypes.STRING, allowNull: false },
    ficheiro_base64: { type: DataTypes.TEXT, allowNull: false },
    mime_type:       { type: DataTypes.STRING },
    versao:          { type: DataTypes.STRING },
    publicado_cliente: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at:      { type: DataTypes.DATE }
}, { tableName: 'relatorio', timestamps: false })

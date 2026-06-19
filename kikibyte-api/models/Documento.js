import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Documento = sequelize.define('Documento', {
    id_documento:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente_id:     { type: DataTypes.INTEGER, allowNull: false },
    pedido_id:      { type: DataTypes.INTEGER },
    uploaded_by:    { type: DataTypes.INTEGER },
    titulo:         { type: DataTypes.STRING, allowNull: false },
    tipo_documento: { type: DataTypes.STRING, allowNull: false },
    ficheiro_base64: { type: DataTypes.TEXT, allowNull: false },
    mime_type:      { type: DataTypes.STRING },
    tamanho_bytes:  { type: DataTypes.BIGINT },
    sensivel:       { type: DataTypes.BOOLEAN, defaultValue: true },
    visivel_cliente: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at:     { type: DataTypes.DATE }
}, { tableName: 'documento', timestamps: false })

import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Mensagem = sequelize.define('Mensagem', {
    id_mensagem:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pedido_id:      { type: DataTypes.INTEGER },
    cliente_id:     { type: DataTypes.INTEGER },
    remetente_id:   { type: DataTypes.INTEGER },
    mensagem:       { type: DataTypes.TEXT, allowNull: false },
    anexo_base64:   { type: DataTypes.TEXT },
    visivel_cliente: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at:     { type: DataTypes.DATE }
}, { tableName: 'mensagem', timestamps: false })

import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const DocumentoMensagem = sequelize.define('DocumentoMensagem', {
    id_mensagem:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    documento_id:   { type: DataTypes.INTEGER, allowNull: false },
    remetente_id:   { type: DataTypes.INTEGER },
    mensagem:       { type: DataTypes.TEXT, allowNull: false },
    created_at:     { type: DataTypes.DATE }
}, {
    tableName: 'documento_mensagem',
    timestamps: false
})

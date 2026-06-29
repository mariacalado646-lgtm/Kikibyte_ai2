import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const MensagemDireta = sequelize.define('MensagemDireta', {
    id_mensagem:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente_id:     { type: DataTypes.INTEGER, allowNull: false },
    remetente_id:   { type: DataTypes.INTEGER, allowNull: false },
    mensagem:       { type: DataTypes.TEXT, allowNull: false },
    created_at:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'mensagem_direta',
    timestamps: false
})

// Association added in index.js:
// MensagemDireta.belongsTo(Utilizador, { foreignKey: 'remetente_id', as: 'remetente' })

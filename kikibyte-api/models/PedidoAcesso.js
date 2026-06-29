import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const PedidoAcesso = sequelize.define('PedidoAcesso', {
    id_pedido:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome_empresa:     { type: DataTypes.STRING, allowNull: false },
    pessoa_contacto:  { type: DataTypes.STRING, allowNull: false },
    email:            { type: DataTypes.STRING, allowNull: false },
    telefone:         { type: DataTypes.STRING, allowNull: false },
    nif:              { type: DataTypes.STRING },
    status:           { type: DataTypes.STRING, defaultValue: 'pending' },
    tratado_por:      { type: DataTypes.INTEGER },
    created_at:       { type: DataTypes.DATE },
    updated_at:       { type: DataTypes.DATE }
}, {
    tableName: 'pedido_acesso',
    timestamps: false
})

import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const PermissaoCliente = sequelize.define('PermissaoCliente', {
    id_permissao:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente_id:       { type: DataTypes.INTEGER, allowNull: false },
    funcionalidade:   { type: DataTypes.STRING, allowNull: false },
    ativo:            { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at:       { type: DataTypes.DATE },
    updated_at:       { type: DataTypes.DATE }
}, { tableName: 'permissao_cliente', timestamps: false })

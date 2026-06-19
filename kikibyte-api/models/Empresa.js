import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Empresa = sequelize.define('Empresa', {
    id_empresa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome:       { type: DataTypes.STRING, allowNull: false },
    nif:        { type: DataTypes.STRING },
    email:      { type: DataTypes.STRING },
    telefone:   { type: DataTypes.STRING },
    website:    { type: DataTypes.STRING },
    descricao:  { type: DataTypes.TEXT },
    missao:     { type: DataTypes.TEXT },
    visao:      { type: DataTypes.TEXT },
    valores:    { type: DataTypes.TEXT },
    logo_base64: { type: DataTypes.TEXT },
    ativo:      { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE }
}, { tableName: 'empresa', timestamps: false })

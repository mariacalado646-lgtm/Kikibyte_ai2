import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Utilizador = sequelize.define('User', {
    id_utilizador:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    empresa_id:   { type: DataTypes.INTEGER },
    cliente_id:    { type: DataTypes.INTEGER },
    role_id:      { type: DataTypes.INTEGER, allowNull: false },
    nome:         { type: DataTypes.STRING,  allowNull: false },
    email:        { type: DataTypes.STRING,  allowNull: false, unique: true },
    password_hash:  { type: DataTypes.STRING,  allowNull: false },
    foto_perfil_base64:{ type: DataTypes.TEXT },
    ativo:       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    ultimo_login:   { type: DataTypes.DATE },
    created_at:   { type: DataTypes.DATE,    allowNull: false },
    updated_at:   { type: DataTypes.DATE,    allowNull: false }
}, {
    tableName: 'utilizador',
    timestamps: false
})

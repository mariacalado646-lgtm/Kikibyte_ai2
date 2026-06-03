import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Role = sequelize.define('Role', {
  id_role:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome:         { type: DataTypes.STRING,  allowNull: false },
  descricao:    { type: DataTypes.STRING },
  ativo:        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  created_at:   { type: DataTypes.DATE,    allowNull: false }
}, {
  tableName: 'roles',
  timestamps: false
})

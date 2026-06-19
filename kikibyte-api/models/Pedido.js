import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const Pedido = sequelize.define('Pedido', {
    id_pedido:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente_id:   { type: DataTypes.INTEGER, allowNull: false },
    servico_id:   { type: DataTypes.INTEGER },
    criado_por:   { type: DataTypes.INTEGER },
    atribuido_a:  { type: DataTypes.INTEGER },
    titulo:       { type: DataTypes.STRING, allowNull: false },
    descricao:    { type: DataTypes.TEXT },
    estado:       { type: DataTypes.STRING, defaultValue: 'pendente' },
    prioridade:   { type: DataTypes.STRING, defaultValue: 'normal' },
    anexo_base64: { type: DataTypes.TEXT },
    data_criacao: { type: DataTypes.DATE },
    data_fecho:   { type: DataTypes.DATE },
    tipo:         { type: DataTypes.STRING, defaultValue: 'pedido' }
}, { tableName: 'pedido', timestamps: false })

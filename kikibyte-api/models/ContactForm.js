import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const ContactForm = sequelize.define('ContactForm', {
    id_contacto_form:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome:               { type: DataTypes.STRING,  allowNull: false },
    email:              { type: DataTypes.STRING,  allowNull: false },
    telefone:           { type: DataTypes.STRING },
    empresa:            { type: DataTypes.STRING,  allowNull: false },
    mensagem:           { type: DataTypes.TEXT,    allowNull: false, allowNull: false },
    estado:             { type: DataTypes.STRING,  allowNull: false, defaultValue: 'novo' },
    tratado_por:        { type: DataTypes.INTEGER },
    data_envio:         { type: DataTypes.DATE,    allowNull: false, defaultValue: DataTypes.NOW },
    doc_base64:         { type: DataTypes.TEXT }
}, {
    tableName: 'formulario_contacto',
    timestamps: false
})

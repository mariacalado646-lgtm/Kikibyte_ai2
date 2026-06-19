export const Cliente = sequelize.define('Cliente', {
    id_cliente:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    empresa_id:           { type: DataTypes.INTEGER },
    nome:                 { type: DataTypes.STRING, allowNull: false },
    nif:                  { type: DataTypes.STRING },
    setor:                { type: DataTypes.STRING },
    email:                { type: DataTypes.STRING },
    telefone:             { type: DataTypes.STRING },
    morada:               { type: DataTypes.STRING },
    foto_base64:          { type: DataTypes.TEXT },
    ativo:                { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at:           { type: DataTypes.DATE },
    updated_at:           { type: DataTypes.DATE },
    estado_conformidade:  { type: DataTypes.STRING }
}, { tableName: 'cliente', timestamps: false })

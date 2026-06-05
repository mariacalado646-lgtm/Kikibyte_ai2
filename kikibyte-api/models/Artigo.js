import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const CategoriaArtigo = sequelize.define('CategoriaArtigo', {
    id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome:         { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'categoria_artigo',
    timestamps: false
})

export const Artigo = sequelize.define('Artigo', {
    id_artigo:          { type: DataTypes.INTEGER,  primaryKey: true, autoIncrement: true },
    id_categoria:       { type: DataTypes.INTEGER },
    titulo:             { type: DataTypes.STRING,   allowNull: false },
    slug:               { type: DataTypes.STRING,   allowNull: false, unique: true },
    resumo:             { type: DataTypes.TEXT },
    conteudo:           { type: DataTypes.TEXT,     allowNull: false },
    imagem_capa_base64: { type: DataTypes.TEXT },
    estado:             { type: DataTypes.STRING,   allowNull: false, defaultValue: 'rascunho' },
    autor_id:           { type: DataTypes.INTEGER },
    published_at:       { type: DataTypes.DATE },
    created_at:         { type: DataTypes.DATE,     allowNull: false},
    updated_at:         { type: DataTypes.DATE,     allowNull: false }
}, {
    tableName: 'artigo',
    timestamps: false
})

Artigo.belongsTo(CategoriaArtigo, { foreignKey: 'id_categoria', as: 'categoria_artigo' })

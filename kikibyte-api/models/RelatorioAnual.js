import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const RelatorioAnual = sequelize.define('RelatorioAnual', {
    id_relatorio_anual: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cliente_id:         { type: DataTypes.INTEGER, allowNull: false },
    ano:                { type: DataTypes.INTEGER, allowNull: false },
    periodo:            { type: DataTypes.STRING, defaultValue: 'annual' },
    resumo:             { type: DataTypes.TEXT },
    auditorias:         { type: DataTypes.INTEGER, defaultValue: 0 },
    problemas_encontrados: { type: DataTypes.INTEGER, defaultValue: 0 },
    problemas_resolvidos:  { type: DataTypes.INTEGER, defaultValue: 0 },
    ficheiros_processados: { type: DataTypes.INTEGER, defaultValue: 0 },
    recomendacoes:      { type: DataTypes.TEXT },
    criado_por:         { type: DataTypes.INTEGER },
    created_at:         { type: DataTypes.DATE }
}, { tableName: 'relatorio_anual', timestamps: false })

const { db, Sequelize } = require('../database/db');

const DadosDep = db.define('dados_dep', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    cep: Sequelize.INTEGER,
    nome: Sequelize.STRING,
    endereco: Sequelize.STRING,
    bairro: Sequelize.STRING,
    estado: Sequelize.STRING(2),
    cidade: Sequelize.STRING,
    retorno_api: Sequelize.JSON,
}, {
    timestamp: true,
    tableName: 'dados_dep',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = DadosDep;
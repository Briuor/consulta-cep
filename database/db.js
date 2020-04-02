const Sequelize = require('sequelize');
require('dotenv').config()

try {
    const db = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    });

    module.exports = { db, Sequelize };
} catch (err) {
    console.log(err, 'Erro ao conectar-se ao banco de dados.');
    db.close();
}
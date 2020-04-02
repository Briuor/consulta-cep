const Sequelize = require('sequelize');

try {
    const db = new Sequelize('smarkio', 'root', 'g9cr5kuj', {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    });

    module.exports = { db, Sequelize };
} catch (err) {
    console.log(err, 'Erro ao conectar-se ao banco de dados.');
    db.close();
}
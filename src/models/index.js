import Sequelize from 'sequelize';
import path from 'path';


const config = require(path.join(__dirname, '..', 'config', 'config.json'))['develup'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config  
)

export { sequelize, Sequelize };  
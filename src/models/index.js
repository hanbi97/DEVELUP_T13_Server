import Sequelize from 'sequelize';
import path from 'path';

import {User} from './User';
import {Organization} from './Organization';


const config = require(path.join(__dirname, '..', 'config', 'config.json'))['develup'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config  
)

const user = User(sequelize,Sequelize);
const organization = Organization(sequelize,Sequelize);

export { sequelize, Sequelize };  
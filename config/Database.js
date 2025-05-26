import {Sequelize} from "sequelize";

const db = new Sequelize('myouinotes', 'root', '', {
    host: '34.42.217.220', // public ip dari gcp
    dialect: 'mysql'
});

export default db;

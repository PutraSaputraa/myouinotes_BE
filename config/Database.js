import {Sequelize} from "sequelize";

const db = new Sequelize('myouinotes', 'root', '', {
    host: 'localhost', // public ip dari gcp
    dialect: 'mysql'
});

export default db;

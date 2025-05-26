import { Sequelize } from "sequelize";
import db from "../config/Database.js";


const User = db.define(
    'users', {
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        refresh_token: Sequelize.STRING
    }, {
        freezeTableName: true,
        timestamps: false
    }
);

export default User;

(async()=>{
    await db.sync();
})();

import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";


const Note = db.define(
    'notes', {
        judul: DataTypes.STRING,
        isi_catatan: DataTypes.STRING,
        user_id: DataTypes.INTEGER
    }, {
        freezeTableName: true,
        createdAt: "tanggal_dibuat",
        updatedAt: "tanggal_diubah",
    }
);  

User.hasMany(Note, { foreignKey: "user_id" });
Note.belongsTo(User, { foreignKey: "user_id" });

export default Note;

(async()=>{
    await db.sync({alter : true});
})();


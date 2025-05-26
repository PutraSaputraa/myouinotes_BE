import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// Test connection
(async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connected!");
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
})();

export default db;

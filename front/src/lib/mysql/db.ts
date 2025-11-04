import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: import.meta.env.DB_HOST || "localhost",
  username: import.meta.env.DB_USER,
  password: import.meta.env.DB_PASSWORD,
  database: import.meta.env.DB_NAME,
  logging: false,

  pool: {
    max: 15,
    min: 5,
    acquire: 30000,
    idle: 20000,
  },

  dialectOptions: {
    connectTimeout: 60000,
    flags: "-FOUND_ROWS",
  },

  retry: {
    max: 3,
  },
});

export async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}

export default sequelize;

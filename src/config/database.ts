import mysql2 from 'mysql2';
import logger from '../utilities/logger';
import envs from '../config/env';

const { database } = envs;

const sequelizeConfig = {
  host: database.host,
  username: database.username,
  password: database.password,
  database: database.database,
  port: +database.port,
  'migrations-path': './src/core/database/migrations',
  'seeders-path': './src/core/database/seeders',
  dialect: 'mysql' as any,
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectModule: mysql2,
  define: {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  logQueryParameters: true,
  logging: (str: string): any => {
    return database.showDBlogs ? logger.info(`[SEQUELIZE DATABASE] ${str}`) : null;
  },
};

export const development = { ...sequelizeConfig };

export const staging = { ...sequelizeConfig };

export const production = { ...sequelizeConfig };

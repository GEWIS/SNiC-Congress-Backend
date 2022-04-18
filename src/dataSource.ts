import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';

const dotEnvPath = path.join(__dirname, '../.env');
dotenv.config({ path: dotEnvPath });

let options: DataSourceOptions;

switch (process.env.TYPEORM_CONNECTION) {
  case 'sqlite':
    options = {
      type: 'sqlite',
      database: process.env.TYPEORM_DATABASE!,
    };
    break;
  case 'mysql':
  case 'mariadb':
    options = {
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT || '3001', 10),
      database: process.env.TYPEORM_DATABASE,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
    };
    break;
  default:
    throw new Error(`Unknown database type: "${process.env.TYPEORM_CONNECTION}".`);
}

options = {
  ...options,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscribers/**/*.js'],
};

const AppDataSource = new DataSource(options);

export default AppDataSource;

import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.template' });

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DATABASE_URL,
  SERVER_PORT,
  FIREBASE_SERVICE_ACCOUNT_PATH
} = process.env;

let newDatabaseUrl = DATABASE_URL;

if (!DATABASE_URL) {
  if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
    throw new Error('Missing one or more required DB environment variables and have no DB URL.');
  }
  newDatabaseUrl = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

const output = [
  `DATABASE_URL=${newDatabaseUrl}`,
  `FIREBASE_SERVICE_ACCOUNT_PATH=${FIREBASE_SERVICE_ACCOUNT_PATH || ''}`,
  `SERVER_PORT=${SERVER_PORT || 3000}`
].join('\n');

fs.writeFileSync('.env', output);

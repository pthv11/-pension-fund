import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log('Configuring database connection...');
console.log('Database URL format check:', process.env.DATABASE_URL.split(':')[0]);

// Создаем пул подключений
// На Render PostgreSQL требует SSL, поэтому проверяем наличие DATABASE_URL от Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' || process.env.DATABASE_URL?.includes('render.com') ? {
    rejectUnauthorized: false
  } : false
});

// Создаем экземпляр Drizzle ORM
export const db = drizzle(pool, { schema });

// Инициализируем базу данных
async function initializeDatabase() {
  let client;
  try {
    console.log('Initializing database connection...');
    
    // Проверяем подключение к базе данных
    console.log('Testing database connection...');
    client = await pool.connect();
    
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('Database connection details:', {
      version: result.rows[0].version,
      database: result.rows[0].current_database,
      user: result.rows[0].current_user
    });
    
    console.log('Database initialization completed successfully');
  } catch (error: any) {
    console.error('Database initialization error details:', {
      name: error?.name || 'Unknown',
      message: error?.message || 'No error message',
      code: error?.code,
      stack: error?.stack
    });
    throw new Error('Failed to initialize database: ' + (error?.message || 'Unknown error'));
  } finally {
    if (client) {
      console.log('Releasing database connection...');
      await client.release();
    }
  }
}

// Обработчик закрытия приложения
process.on('SIGINT', async () => {
  console.log('Closing database pool...');
  await pool.end();
  process.exit(0);
});

// Экспортируем функцию инициализации и объект базы данных
console.log('Creating Drizzle ORM instance...');
export const initialize = initializeDatabase;
import { db } from './db';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем путь к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  try {
    console.log('Starting database migration...');
    
    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '0000_initial.sql');
    console.log('Migration file path:', migrationPath);
    
    // Check if file exists
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found at ${migrationPath}`);
    }
    
    // Read migration file
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('Migration SQL loaded successfully');
    
    // Execute migration
    await db.execute(migrationSQL);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate(); 
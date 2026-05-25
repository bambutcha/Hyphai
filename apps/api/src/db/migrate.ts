import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, 'migrations', '001_init.sql'), 'utf8');

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
await client.query(sql);
await client.end();

console.log('Migration complete');

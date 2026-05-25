import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, 'migrations');
const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

const client = new pg.Client({ connectionString: databaseUrl });

async function connectWithRetry(maxAttempts = 10): Promise<pg.Client> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.connect();
      return client;
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      console.log(`DB connect attempt ${attempt} failed, retrying…`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error('unreachable');
}

await connectWithRetry();

for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), 'utf8');
  console.log(`Running migration: ${file}`);
  await client.query(sql);
}

await client.end();
console.log('All migrations complete');

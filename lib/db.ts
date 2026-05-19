import sql from 'mssql';

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readBooleanEnv(name: string): boolean {
  const value = process.env[name]?.trim().toLowerCase();

  if (value === 'true') return true;
  if (value === 'false') return false;

  throw new Error(`${name} must be explicitly set to "true" or "false"`);
}

function readPortEnv(name: string, fallback: number): number {
  const rawValue = process.env[name]?.trim();
  if (!rawValue) {
    return fallback;
  }

  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`${name} must be a valid TCP port number`);
  }

  return parsed;
}

const config: sql.config = {
  server: readRequiredEnv('DB_SERVER'),
  database: readRequiredEnv('DB_NAME'),
  authentication: {
    type: 'default',
    options: {
      userName: readRequiredEnv('DB_USER'),
      password: readRequiredEnv('DB_PASSWORD'),
    },
  },
  options: {
    encrypt: readBooleanEnv('DB_ENCRYPT'),
    trustServerCertificate: readBooleanEnv('DB_TRUST_CERT'),
    port: readPortEnv('DB_PORT', 1433),
  },
};

let pool: sql.ConnectionPool | undefined;

export async function getConnection() {
  if (!pool) {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
  }

  return pool;
}

export async function closeConnection() {
  if (pool) {
    await pool.close();
    pool = undefined;
  }
}

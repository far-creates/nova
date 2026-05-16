import sql from 'mssql';

// Validate required environment variables
const requiredEnvVars = ['DB_SERVER', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Build configuration – no fallbacks to hardcoded credentials
const config: sql.config = {
  server: process.env.DB_SERVER!,      // guaranteed by check above
  database: process.env.DB_NAME!,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
    },
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',   // defaults to false if not 'true'
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    port: parseInt(process.env.DB_PORT || '1433', 10),
  },
};

let pool: sql.ConnectionPool;

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
  }
}
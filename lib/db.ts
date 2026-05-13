import sql from 'mssql';

const config: sql.config = {
  server: process.env.DB_SERVER || 'ADMINISTRATOR\\FARSERVER',
  database: process.env.DB_NAME || 'listening_app',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || '',
    },
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true' ? true : true,
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true' ? true : true,
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
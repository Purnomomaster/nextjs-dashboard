const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client
  .connect()
  .then(() => console.log('Connected to the database successfully.'))
  .catch((err) => console.error('Database connection error:', err));

module.exports = client;

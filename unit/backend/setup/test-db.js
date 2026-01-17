/**
Copyright 2026 JasmineGraph Team
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

const { Pool } = require('pg');

class TestDatabase {
  constructor() {
    this.pool = null;
  }

  async connect() {
    const testDbUrl = process.env.TEST_POSTGRES_URL || 'postgresql://test:test@localhost:5432/jasminegraph_test';

    this.pool = new Pool({
      connectionString: testDbUrl,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test the connection
    const client = await this.pool.connect();
    await client.query('SELECT 1');
    client.release();

    return this.pool;
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async createTables() {
    if (!this.pool) throw new Error('Database not connected');

    const client = await this.pool.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS clusters (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          host VARCHAR(255) NOT NULL,
          port INTEGER NOT NULL,
          user_ids TEXT[] DEFAULT '{}',
          cluster_owner VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS graphs (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          nodes JSONB,
          edges JSONB,
          cluster_id INTEGER REFERENCES clusters(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

    } finally {
      client.release();
    }
  }

  async clearTables() {
    if (!this.pool) throw new Error('Database not connected');

    const client = await this.pool.connect();

    try {
      // Clear all data but keep tables
      await client.query('DELETE FROM graphs');
      await client.query('DELETE FROM clusters');
      await client.query('DELETE FROM users');

      // Reset sequences
      await client.query('ALTER SEQUENCE clusters_id_seq RESTART WITH 1');

    } finally {
      client.release();
    }
  }

  getPool() {
    if (!this.pool) throw new Error('Database not connected');
    return this.pool;
  }
}

const testDb = new TestDatabase();

module.exports = { testDb };

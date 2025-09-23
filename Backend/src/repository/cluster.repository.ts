import { pool } from '../databaseConnection';

export interface Cluster {
  id: number;
  name: string;
  description: string | null;
  host: string;
  port: number;
  user_ids: string[];
  cluster_owner: string;
  created_at: string;
  updated_at: string;
}

export async function createClusterRepo(cluster: Omit<Cluster, 'id' | 'created_at' | 'updated_at'>): Promise<Cluster> {
  const result = await pool.query(
    `INSERT INTO clusters (name, description, host, port, user_ids, cluster_owner)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [cluster.name, cluster.description, cluster.host, cluster.port, cluster.user_ids, cluster.cluster_owner]
  );
  return result.rows[0];
}

export async function getAllClustersRepo(): Promise<Cluster[]> {
  const result = await pool.query('SELECT * FROM clusters ORDER BY created_at DESC');
  return result.rows;
}

export async function getClusterByIdRepo(id: number): Promise<Cluster | null> {
  const result = await pool.query('SELECT * FROM clusters WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function addUserToClusterRepo(clusterID: number, userID: string): Promise<Cluster | null> {
  const result = await pool.query(
    `UPDATE clusters SET user_ids = array_append(user_ids, $1), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
    [userID, clusterID]
  );
  return result.rows[0] || null;
}

export async function removeUserFromClusterRepo(clusterID: number, userID: string): Promise<Cluster | null> {
  const result = await pool.query(
    `UPDATE clusters SET user_ids = array_remove(user_ids, $1), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
    [userID, clusterID]
  );
  return result.rows[0] || null;
}

export async function getMyClustersRepo(userID: string): Promise<Cluster[]> {
  const result = await pool.query(
    `SELECT * FROM clusters WHERE cluster_owner = $1 OR $1 = ANY(user_ids)`,
    [userID]
  );
  return result.rows;
}
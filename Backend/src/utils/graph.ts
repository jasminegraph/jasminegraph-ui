import fs from 'fs';
import path from 'path';

export interface INode {
  id: number;
  label: string;
  color: string;
  shape: string;
}

export interface IEdge {
  from: number;
  to: number;
}

export interface Graph {
  nodes: INode[];
  edges: IEdge[];
}

export const parseGraphFile = (filePath: string): Graph => {
  // Read the file content
  const fileContent = fs.readFileSync(path.resolve(filePath), 'utf-8');

  // Split the content into lines and process each line
  const lines = fileContent.trim().split('\n');

  const nodesMap = new Map<number, INode>();
  const edges: IEdge[] = [];

  lines.forEach((line) => {
    const [from, to] = line.split(' ').map(Number);

    // Add nodes to the map to ensure uniqueness
    if (!nodesMap.has(from)) {
      nodesMap.set(from, { id: from, label: `Node ${from}`, shape: 'dot', color: '#97c2fc' });
    }
    if (!nodesMap.has(to)) {
      nodesMap.set(to, { id: to, label: `Node ${to}`, shape: 'dot', color: '#97c2fc' });
    }

    // Add the edge
    edges.push({ from, to });
  });

  // Convert the map of nodes to an array
  const nodes = Array.from(nodesMap.values());

  return { nodes, edges };
};
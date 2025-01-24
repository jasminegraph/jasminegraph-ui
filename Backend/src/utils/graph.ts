/**
Copyright 2025 JasminGraph Team
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
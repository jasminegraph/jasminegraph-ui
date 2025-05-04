/**
Copyright 2025 JasmineGraph Team
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
  properties: any;
}

export interface IEdge {
  from: number;
  to: number;
  properties: any;
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
    const jsonLine = JSON.parse(line);
    const from = jsonLine.source
    const to = jsonLine.destination
    const edge = jsonLine.properties

    // // Add nodes to the map to ensure uniqueness
    if (!nodesMap.has(from.id)) {
      nodesMap.set(from.id, { id: from.id, label: from.properties.name || from.properties.type || `Node ${from.id}`, properties: from.properties || '',  shape: 'dot', color: '#97c2fc' });
    }
    if (!nodesMap.has(to.id)) {
      nodesMap.set(to.id, { id: to.id, label: to.properties.name || to.properties.type || `Node ${to.id}`, properties: to.properties || '',  shape: 'dot', color: '#97c2fc' });
    }

    edges.push({ from: from.id, to: to.id, properties: edge });
  });

  // Convert the map of nodes to an array
  const nodes = Array.from(nodesMap.values());

  return { nodes, edges };
};
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

export const GRAPH_TYPES = {
  INDEGREE: "in_degree",
  OUTDEGREE: "out_degree"
} as const;

export type GraphType = (typeof GRAPH_TYPES)[keyof typeof GRAPH_TYPES];

export const GRAPH_VISUALIZATION_TYPE = [
  {
    value: "full_view",
    label: "Full View"
  },
  {
    value: GRAPH_TYPES.INDEGREE,
    label: "In Degree"
  },
  {
    value: GRAPH_TYPES.OUTDEGREE,
    label: "Out Degree"
  },
] as const;

export type GraphVisualizationType = (typeof GRAPH_VISUALIZATION_TYPE)[number]["value"]

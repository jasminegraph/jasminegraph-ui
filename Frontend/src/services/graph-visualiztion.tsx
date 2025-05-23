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

'use client';
import {authApi} from "./axios";

export async function getGraphVizualization(id: string) {
  try {
    const result = await authApi({
      method: "get",
      url: `/backend/graph/visualize?id=${id}`,
    }).then((res) => res.data);
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getGraphDegreeData(graphId: string, type: string){
  try {
    const result = await authApi({
      method: "post",
      url: `/backend/graph/degree`,
      data: {
        graphId,
        type
      },
    }).then((res) => res.data);
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
}
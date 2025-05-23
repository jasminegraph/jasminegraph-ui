/**
Copyright 2024 JasmineGraph Team
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

import { AnalyzeOptions } from "@/data/analyze-data";
import { authApi } from "./axios";
import { AxiosResponse } from "axios";

export async function analyzeGraph(values: any) {
  var endpoint = `/backend/graph/analyze/`;
  switch (values.method) {
    case AnalyzeOptions.TRIANGLECOUNT:
      endpoint += `trianglecount`;
      break;
  }

  try {
    const result: AxiosResponse<any> = await authApi({
      method: "post",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        ...values
      },
    });

    return {
      data: result.data,
    };
  } catch (err: any) {
    if (err.response) {
      return {
        message: err.response.data.message,
      };
    } else {
      return Promise.reject();
    }
  }
}

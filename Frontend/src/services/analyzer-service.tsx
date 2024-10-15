import { AnalyzeOptions } from "@/data/analyze-data";
import { authApi } from "./axios";
import { AxiosResponse } from "axios";

export async function analyzeGraph(values: any) {
  var endpoint = `/backend/graph/analyze/`;
  switch (values.method) {
    case AnalyzeOptions.TRIANGLECOUNT:
      endpoint += `trianglecount`;
      break;
    // case AnalyzeOptions.PAGERANK:
    //   endpoint += `pagerank`;
    //   break;
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
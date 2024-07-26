import { AxiosResponse } from "axios";
import {authApi} from "./axios";

interface ApiResponse<T> {
  data: T;
}

interface ApiErrorResponse {
  message: string;
}

export async function addNewCluster(name: string, description: string, host: string, port: string): Promise<ApiResponse<string> | ApiErrorResponse> {
  try {
    const result: AxiosResponse<any> = await authApi({
      method: "post",
      url: "/backend/clusters",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name,
        description,
        host,
        port,
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
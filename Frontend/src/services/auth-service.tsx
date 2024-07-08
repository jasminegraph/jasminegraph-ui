import axios, { AxiosResponse } from "axios";

interface ApiResponse<T> {
  data: T;
}

interface ApiErrorResponse {
  message: string;
}

export async function userLogin(username: string, password: string): Promise<ApiResponse<string> | ApiErrorResponse> {
  try {
    const result: AxiosResponse<any> = await axios({
      method: "post",
      url: "/backend/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username,
        password,
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

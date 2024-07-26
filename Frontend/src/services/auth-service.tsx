import axios, { AxiosResponse } from "axios";
import { authApi } from "./axios";

interface ApiResponse<T> {
  data: T;
}

interface ApiErrorResponse {
  message: string;
}

export async function userLogin(username: string, password: string){
  try {
    const result: AxiosResponse<any> = await axios({
      method: "post",
      url: "/backend/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: username,
        password,
      },
    });

    return {
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken
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

export async function registerAdmin(name: string, email: string, password: string): Promise<ApiResponse<string> | ApiErrorResponse> {
  try {
    const result: AxiosResponse<any> = await axios({
      method: "post",
      url: "/backend/users/admin",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        fullName: name,
        email,
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


export async function getUserDataByToken(){
  try {
    const result: AxiosResponse<any> = await authApi({
      method: "get",
      url: "/backend/users/data-by-token",
      headers: {
        "Content-Type": "application/json",
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



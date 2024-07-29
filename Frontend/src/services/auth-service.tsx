import axios, { AxiosResponse } from "axios";
import { authApi } from "./axios";

interface ApiResponse<T> {
  data: T;
}

interface ApiErrorResponse {
  message: string;
}

export async function pingBackend(){
  try {
    const result: AxiosResponse<any> = await axios({
      method: "get",
      url: "/backend/ping",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.data.message === "pong") {
      return true;
    }
    return false;
  } catch (err: any) {
    return false;
  }
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

export async function registerUser(name: string, email: string, password: string, role: string): Promise<ApiResponse<string> | ApiErrorResponse> {
  try {
    const result: AxiosResponse<any> = await axios({
      method: "post",
      url: "/backend/auth/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        fullName: name,
        email,
        password,
        role
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


export async function getUserDataByToken(token: string){
  try {
    const result: AxiosResponse<any> = await axios({
      method: "get",
      url: "/backend/users/token",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    });

    return {
      data: result.data,
    };
  } catch (err: any) {
      return Promise.reject();
  }
}



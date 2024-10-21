'use client';
import { AxiosResponse } from "axios";
import {authApi} from "./axios";

interface ApiResponse<T> {
  data: T;
}

interface ApiErrorResponse {
  message: string;
}

export async function addNewCluster(name: string, description: string, host: string, port: string, token: string | null): Promise<ApiResponse<string> | ApiErrorResponse> {
  try {
    const result: AxiosResponse<any> = await authApi({
      method: "post",
      url: "/backend/clusters",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
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

export async function getAllClusters(userID: string) {
  try {
    const result = await authApi({
      method: "get",
      url: `/backend/clusters/myClusters/${userID}`,
    }).then((res) => res.data);
    return {
      data: result.data,
    };
  } catch (err) {
    return Promise.reject();
  }
}

export async function getCluster(clusterID: string) {
  try {
    const result = await authApi({
      method: "get",
      url: `/backend/clusters/${clusterID}`,
    }).then((res) => res.data);
    return {
      data: result.data,
    };
  } catch (err) {
    return Promise.reject();
  }
}

export async function addUserToCluster(userID: string, clusterID: string){
  try {
    const result = await authApi({
      method: "post",
      url: `/backend/clusters/addUser`,
      data: {
        userID, 
        clusterID,
      },
    }).then((res) => res.data);
    return {
      data: result.data,
    };
  } catch (err) {
    return Promise.reject();
  }
}

export async function removeUserFromCluster(userID: string, clusterID: string){
  try {
    const result = await authApi({
      method: "post",
      url: `/backend/clusters/removeUser`,
      data: {
        userID, 
        clusterID,
      },
    }).then((res) => res.data);
    return {
      data: result.data,
    };
  } catch (err) {
    return Promise.reject();
  }
}
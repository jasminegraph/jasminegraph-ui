'use client';
import {authApi} from "./axios";

export async function getGraphList() {
  try {
    const result = await authApi({
      method: "get",
      url: `/backend/graph/list`,
    }).then((res) => res.data);
    return {
      data: result,
    };
  } catch (err) {
    return Promise.reject();
  }
}

export async function deleteGraph(id: string) {
  try {
    const result = await authApi({
      method: "delete",
      url: `/backend/graph/${id}`,
    }).then((res) => res.data);
    return {
      data: result,
    };
  } catch (err) {
    return Promise.reject();
  }
}
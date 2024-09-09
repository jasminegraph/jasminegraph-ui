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
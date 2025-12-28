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

'use client';
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/hooks/useAccessToken";
import { SELECTED_CLUSTER } from "@/hooks/useCluster";

const getAccessToken = () => {
    if (typeof window === "undefined") {
        return null;
    }
    return localStorage.getItem(ACCESS_TOKEN);
}

const getClusterID = () => {
    if (typeof window === "undefined") {
        return null;
    }
    return localStorage.getItem(SELECTED_CLUSTER);
}   

export const authApi = axios.create({
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + getAccessToken(),
      "Cluster-ID": getClusterID(),
  }
})

const api = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const tokenStr = sessionStorage.getItem("AUTH");
        try {
            if (tokenStr) {
                const token = JSON.parse(tokenStr);
                if (token) {
                    config.headers[
                        "Authorization"
                    ] = `Bearer ${token?.access_token}`;
                }
            }
        } catch (e) {
            console.log(e);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
          console.log(
            "[AXIOS] No refresh token available, redirecting to login"
          );
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          window.location.href = "/auth";
          return Promise.reject(error);
        }

        const response = await axios.post("/backend/auth/refresh-token", {
          token: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, newRefreshToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return axios(originalRequest);
      } catch (refreshError) {
        console.error("[AXIOS] Token refresh failed:", refreshError);
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          console.error("[AXIOS] Bad Request:", data);
          break;
        case 500:
          console.error(
            "[AXIOS] Internal Server Error. Please try again later."
          );
          break;
        default:
          console.error("[AXIOS] An error occurred:", status, data);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

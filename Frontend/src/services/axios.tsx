import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/hooks/useAccessToken";
import axios from "axios";

export const authApi = axios.create({
  headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + localStorage.getItem(ACCESS_TOKEN),
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
        } catch (e) {}
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 400:
                    console.error(data || "Bad Request");
                    break;
                case 401:
                    console.error("Unauthorized access. Please log in.");
                    break;
                case 500:
                    console.error(
                        "Internal Server Error. Please try again later."
                    );
                    break;
                default:
                    console.error("An error occurred. Please try again.");
            }
            if (
                status === 400 &&
                data?.find((d: any) => d?.ErrorCode === "0014")
            ) {
                try {
                    originalRequest._retry = true;
                    const tokenStr = localStorage.getItem(REFRESH_TOKEN);
                    if (tokenStr) {
                            const url = "/backend/auth/refresh";
                            return axios
                                .post(
                                    url,
                                    { token: tokenStr },
                                )
                                .then((res) => {
                                    const newAuth = res.data;
                                    originalRequest["headers"][
                                        "Authorization"
                                    ] = `Bearer ${newAuth?.access_token}`;
                                    localStorage.setItem(ACCESS_TOKEN, newAuth?.accessToken);
                                    localStorage.setItem(REFRESH_TOKEN, newAuth?.refreshToken);
                                  
                                    return axios(originalRequest);
                                });
                        }
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
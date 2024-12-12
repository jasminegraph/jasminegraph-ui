/**
Copyright 2024 JasminGraph Team
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

export const ACCESS_TOKEN = "auth.srv.token";
export const REFRESH_TOKEN = "auth.srv.refresh.token";

const useAccessToken = () => {
  const getSrvAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN);
  };

  const setSrvAccessToken = (accessToken: string) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
  }

  const getSrvRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN);
  };

  const setSrvRefreshToken = (refreshToken: string) => {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

  return { getSrvAccessToken, setSrvAccessToken, getSrvRefreshToken, setSrvRefreshToken};
};

export default useAccessToken;
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
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/redux/hook";
import { getUserDataByToken } from "@/services/auth-service";
import { set_User_Data } from "@/redux/features/authData";
import useAccessToken from "@/hooks/useAccessToken";
import { IUserAccessData } from "@/types/user-types";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();
  const { getSrvAccessToken } = useAccessToken();
  const { isUserDataFetched } = useAppSelector((state) => state.authData);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    try {
      setIsLoading(true);
      const token = getSrvAccessToken();
      const res = await getUserDataByToken(token!).then((res) => res.data);
      const userData: IUserAccessData = {
        email: res.data.email,
        fullName: res.data.fullName,
        role: res.data.role,
        enabled: res.data.enabled,
        _id: res.data._id,
      }
      dispatch(set_User_Data(userData));
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.replace("/auth");
      message.error("An error occurred while fetching user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(pathName == "/auth" || pathName == "/setup") return setIsLoading(false);
    if(isUserDataFetched){
      setIsLoading(false);
      return
    }
    const reqToken = getSrvAccessToken();
    if (!isUserDataFetched && reqToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${reqToken}`;
      getUser();
      return;
    }
    if (!reqToken) {
      router.replace("/auth");
      return;
    }
    setIsLoading(false);
  }, [pathName]);

  return isLoading ? (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 70 }} spin />} />
    </div>
  ) : (
    children
  );
};

export default UserProvider;
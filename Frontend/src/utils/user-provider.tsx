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

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();
  const { isUserDataFetched } = useAppSelector((state) => state.authData);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    try {
      setIsLoading(true);
      
      const userData = await getUserDataByToken();
      console.log(userData)
      // dispatch(set_User_Data(userData.role));
      // if (userData.role == "not_assigned") {
      //   router.push(`/onboarding`);
      // }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.replace("/login");
      message.error("An error occurred while fetching user data");
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    const reqToken = localStorage.getItem("token");
    if (!isUserDataFetched && reqToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${reqToken}`;
      getUser();
      return;
    }
    if (
      pathName.startsWith("/dashboard") ||
      pathName.startsWith("/onboarding")
    ) {
      if (!reqToken) {
        router.replace("/login");
        return;
      }
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
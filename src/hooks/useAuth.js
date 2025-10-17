// src/hooks/useAuth.js
import { useSelector } from "react-redux";

const useAuth = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // LocalStorage fallback
  const localUser = JSON.parse(localStorage.getItem("userInfo"));

  const user = userInfo || localUser;

  return {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.role === "admin",
    token: user?.token || null, // handy for API calls
  };
};

export default useAuth;

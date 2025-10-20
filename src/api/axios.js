// // src/api/axios.js
// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true,
// });

// instance.interceptors.request.use((config) => {
//   try {
//     const userInfo = localStorage.getItem("userInfo");
//     if (userInfo) {
//       const { token } = JSON.parse(userInfo);  // 🔥 token extract yahan se
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//   } catch (err) {
//     console.error("Token parse error", err);
//   }
//   return config;
// });

// export default instance;


// src/api/axios.js
import axios from "axios";

// ✅ Base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      const parsed = JSON.parse(stored);

      // ✅ Ensure correct token key (edit according to your actual structure)
      const token =
        parsed.token || parsed.accessToken || parsed.data?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("⚠️ No token found in userInfo");
      }
    }
  } catch (err) {
    console.error("Token parse error", err);
  }
  return config;
});

export default instance;

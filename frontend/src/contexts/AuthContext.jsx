import React, { createContext, useState, useEffect, useContext } from "react";
import api from "@/services/api";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah ada token saat aplikasi pertama kali dimuat
    const loadUserFromToken = async () => {
      if (token) {
        try {
          // Set token ke header default Axios
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          // Ambil data user
          const { data } = await api.get("/auth/me");
          setUser(data);
        } catch (error) {
          console.error("Sesi tidak valid, token dibersihkan.", error);
          // Clear all tokens
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setToken(null);
          setUser(null);
          delete api.defaults.headers.common["Authorization"];
          toast.error("Sesi Anda telah berakhir, silakan login kembali");
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, [token]);

  // Fungsi untuk login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Save both access token and refresh token
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      setToken(data.token);
      setUser(data.user);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login gagal, silakan coba lagi";
      return { success: false, error: errorMessage };
    }
  };

  // Fungsi untuk register
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // Setelah register berhasil, langsung login
      const loginResult = await login(email, password);

      return loginResult;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registrasi gagal, silakan coba lagi";
      return { success: false, error: errorMessage };
    }
  };

  // Fungsi untuk logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  // Fungsi untuk update user data (digunakan setelah refresh token)
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk mempermudah penggunaan context
export const useAuth = () => {
  return useContext(AuthContext);
};

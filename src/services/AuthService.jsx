import { jwtDecode } from "jwt-decode";
import apiConfig from "../configs/apiConfig.jsx";

const authService = {
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  },
  async login(dataReq) {
    try {
      const username = dataReq.get("username");
      const password = dataReq.get("password");
      const res = await fetch(`${apiConfig.baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log(data, "data");
      if (!res.ok) {
        throw new Error(data.message);
      }
      localStorage.setItem("token", data.data);
      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async loginGoogle(dataReq) {
    try {
      const res = await fetch(`${apiConfig.baseUrl}/auth/login-google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataReq),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      localStorage.setItem("token", data.data);
      console.log(data, "data");
      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  },
  async logout() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiConfig.baseUrl}/auth/logout`, {
        method: "POST",
        headers: apiConfig.getAuthHeaders(token),
      });
      const data = await res.json();
      console.log(data, "data");
      if (!res.ok) {
        throw new Error(data.message);
      } else {
        localStorage.clear();
        return data;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  },
  async getUser() {
    try{
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      const res = await fetch(`${apiConfig.baseUrl}/auth/profile/${decode.userId}`, {
        method: "GET",
        headers: apiConfig.getAuthHeaders(token),
      });
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.message);
      }
      return data;
    }catch(e){
      throw new Error(e.message);
    }
  }
};

export default authService;

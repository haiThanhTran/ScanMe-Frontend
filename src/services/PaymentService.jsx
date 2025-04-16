import apiConfig from "../configs/apiConfig.jsx";
import {jwtDecode} from "jwt-decode";

const PaymentService = {
  async getUrlVnPay(dataReq) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Đã hết hạn đăng nhập !!!");
      }
      console.log(dataReq, 123);
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log(currentTime.exp < currentTime, 123);
      if (decodedToken.exp < currentTime) {
        window.location.href = "/403";
        return;
      }

      const res = await fetch(`${apiConfig.baseUrl}/payment/create-url-vnpay`, {
        method: "POST",
        headers: apiConfig.getAuthHeaders(token),
        body: JSON.stringify(dataReq),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};

export default PaymentService;

import apiConfig from "../configs/apiConfig.jsx";
import fetchUtils from "../utils/fetchUtils.jsx";
import {jwtDecode} from "jwt-decode";
const DiscountService = {
  async getAllDiscount() {
    try {
      return await fetchUtils.get("/admin_discount/list_discount");
    } catch (e) {
      throw new Error(e);
    }
  },

  async getDiscountById(id) {
    try {
      return await fetchUtils.get(`/admin_discount/${id}`);
    } catch (e) {
      throw new Error(e);
    }
  },

  async createDiscount(discountData) {
    // try {
    //   return await fetchUtils.post("/admin_discount/add_discount", discountData);
    // } catch (e) {
    //   throw new Error(e);
    // }

     try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Đã hết hạn đăng nhập !!!");
          }
         
    
          const res = await fetch(`${apiConfig.baseUrl}/admin_discount/add_discount`, {
            method: "POST",
            headers: apiConfig.getAuthHeaders(token),
            body: JSON.stringify(discountData),
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

  async updateDiscount(id, discountData) {
    try {
      return await fetchUtils.put(`/admin_discount/update_discount/${id}`, discountData);
    } catch (e) {
      throw new Error(e);
    }

    // try {
    //   const token = localStorage.getItem("token");
    //   if (!token) {
    //     throw new Error("Đã hết hạn đăng nhập !!!");
    //   }
    //   const res = await fetch(`${apiConfig.baseUrl}/admin_discount/update_discount/${id}`, {
    //     method: "PUT",
    //     headers: apiConfig.getAuthHeaders(token),
    //     body: JSON.stringify(discountData),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) {
    //     throw new Error(data.message || "Lỗi khi cập nhật mã giảm giá");
    //   }
    //   return data;
    // } catch (e) {
    //   throw new Error(e);
    // }
  },

  async deleteDiscount(id) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Đã hết hạn đăng nhập !!!");
      }
      const res = await fetch(`${apiConfig.baseUrl}/admin_discount/delete_discount/${id}`, {
        method: "DELETE",
        headers: apiConfig.getAuthHeaders(token),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Lỗi khi xóa mã giảm giá");
      }
      return data;
    } catch (e) {
      throw new Error(e);
    }
},
}
// npm install @mui/x-date-pickers dayjs

export default DiscountService;

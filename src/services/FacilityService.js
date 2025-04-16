import apiConfig from "../configs/apiConfig.jsx";
import fetchUtils from "../utils/fetchUtils.jsx";

const FacilityService = {
  async getAllFacilities() {
    try {
      return await fetchUtils.get("/admin/facility");
    } catch (e) {
      throw new Error(e);
    }
  },

  async getFacilityById(id) {
    try {
      return await fetchUtils.get(`/admin/facility/${id}`);
    } catch (e) {
      throw new Error(e);
    }
  },

  async createFacility(facilityData) {
    try {
      return await fetchUtils.post("/admin/facility", facilityData);
    } catch (e) {
      throw new Error(e);
    }
  },

  async updateFacility(id, facilityData) {
    try {
      return await fetchUtils.put(`/admin/facility/${id}`, facilityData);
    } catch (e) {
      throw new Error(e);
    }
  },

  async deleteFacility(id) {
    try {
      return await fetchUtils.remove(`/admin/facility/${id}`);
    } catch (e) {
      throw new Error(e);
    }
  },
};

export default FacilityService;

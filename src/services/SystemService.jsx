import apiConfig from "../configs/apiConfig.jsx";
import fetchUtils from "../utils/fetchUtils.jsx";

const SystemService = {
    async getAllRouter(){
        try{
            return await fetchUtils.get("/system/get-all-route");
        }catch (e) {
            throw new Error(e);
        }
    },
    
    async createNewRoute(dataReq){
      try{
          return await fetchUtils.post("/system/create-route", dataReq);
      }catch (e) {
          throw new Error(e);
      }
  },
  async getLogRequest(){
    try{
        return await fetchUtils.get("/system/logRequest/get");
    }catch (e) {
        throw new Error(e);
    }
}
}

export default SystemService;

import apiConfig from "../configs/apiConfig.jsx";
import fetchUtils from "../utils/fetchUtils.jsx";

const AdminService = {
    async getRole(){
        try{
            return await fetchUtils.get("/admin/role");
        }catch (e) {
            throw new Error(e);
        }
    },
    
    async createRole(dataReq) {
        try{
            return await fetchUtils.post("/admin/role", dataReq);
        }catch (e) {
            throw new Error(e);
        }
    },
    
    async getPermission() {
        try{
            return await fetchUtils.get("/admin/permission");
        }catch (e) {
            throw new Error(e);
        }
    },
    
    async createPermission(dataReq) {
        try{
            return await fetchUtils.post("/admin/permission", dataReq);
        }catch (e) {
            throw new Error(e);
        }
    },
    
    async getRolePermission(){
        try{
            return await fetchUtils.get("/admin/rolePermission");
        }catch (e) {
            throw new Error(e);
        }
    },
    
    async updateRolePermission(dataReq){
        try{
            return await fetchUtils.put("/admin/rolePermission", dataReq);
        }catch (e) {
            throw new Error(e);
        }
    }
}

export default AdminService;

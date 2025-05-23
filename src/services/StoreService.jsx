import fetchUtils from "../utils/fetchUtils";

const StoreService = {
  getAllStores: async () => {
    try {
      // Assuming fetchUtils.get throws an error on non-2xx responses
      // and directly returns the data payload (the array of stores) on success.
      const data = await fetchUtils.get("/stores", false); // Assuming the API endpoint is /api/stores, false for public
      // Assuming the data returned is directly the array of store objects
      return data; // Return the data directly
    } catch (error) {
      console.error("Error fetching stores:", error);
      return []; // Return empty array in case of error
    }
  },
  // Add other store-related API calls here if needed
};

export default StoreService;

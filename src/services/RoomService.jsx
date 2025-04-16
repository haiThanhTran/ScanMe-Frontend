import apiConfig from "../configs/apiConfig";
import fetchUtils from "../utils/fetchUtils.jsx";

const endpoint = `/room`;

export const getRoomList = async () => {
  try {
    return await fetchUtils.get(endpoint, false);
  } catch (e) {
    console.log("error: ", e.message);
  }
};

export const getRoomById = async (id) => {
  try {
    console.log(id, "id");
    return await fetchUtils.get(`${endpoint}/get-by-id/${id}`, false);
  } catch (e) {
    console.log("error: ", e.message);
  }
};

export const createRoom = async (roomData) => {
  try {
    return await fetchUtils.post(endpoint, roomData);
  } catch (e) {
    throw new Error(e.message);
  }
};

export const deleteRoom = async (id) => {
  try {
    return await fetchUtils.remove(`${endpoint}/${id}`);
  } catch (e) {
    throw new Error(e.message);
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    return await fetchUtils.put(`${endpoint}/${id}`, { roomData });
  } catch (e) {
    throw new Error(e.message);
  }
};

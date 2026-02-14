import api from "../../Utils/axiosInstance/axiosInstance.ts";

export const productExists = async (id: string) => {
  try {
    const res = await api.get(`/product/${id}`);
    return res.data.success;
  } catch (error) {
    console.log(error);
    return error;
  }
};

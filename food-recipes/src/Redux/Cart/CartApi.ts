import api from "../../Utils/axiosInstance/axiosInstance";

export const productExists = async (id: string) => {
  try {
    const res = await api.get(`/product/${id}`);
    return res.data.success;
  } catch (error) {
    console.log(error);
    return error;
  }
};

import api from "../../Utils/axiosInstance/axiosInstance";

export const fetchRecipesById = async (recipeId: string | undefined) => {
  try {
    const res = await api.get(`/product/${recipeId}`);
    return res.data.data
  } catch (error) {
    console.log("Error in fetching the single recipes", error);
    throw error;
  }
};

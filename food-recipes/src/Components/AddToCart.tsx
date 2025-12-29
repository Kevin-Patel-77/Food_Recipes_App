import { NavLink } from "react-router-dom";
import { CookingPot } from "lucide-react";
import { Plus } from "lucide-react";
import { addCart, deleteCart } from "../Redux/CartSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import type { Recipe } from "../Redux/RecipesSlice";
import { Box, Button, Typography } from "@mui/material";

const AddToCart = () => {
  const { items } = useAppSelector((state) => state.foodCart);
  const dispatch = useAppDispatch();

  function handleDelete(id: number) {
    dispatch(deleteCart(id));
  }

  function handleAdd(foodItem: Recipe) {
    dispatch(addCart(foodItem));
  }

  return (
    <Box sx={{ padding: "1rem" }}>
      <Box
        sx={{
          width: "96%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit , minmax(300px , 1fr))",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {items.length > 0 ? (
          items.map((food) => (
            <Box sx={{ margin: "auto", border: "2px solid black", borderRadius: "10px", textAlign: "center", padding: "1rem" }} key={food.id}>
              <Box
                component="img"
                style={{ width: "100%", height: "20rem", border: "1px solid black", borderRadius: "10px", marginTop: "0.8rem" }}
                src={food.image}
                alt={food.name}
              />
              <Box sx={{ color: "#333333", fontSize: "large", fontWeight: "bold" }}>
                <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                  Name: {food.name}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "16px" }}>
                  Meal Type:{" "}
                  {food.mealType.map((meal, index) => (
                    <Box key={index} component="span" sx={{ marginRight: "0.5rem" }}>
                      {meal}
                    </Box>
                  ))}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "1rem", gap: "1rem" }}>
                  <Box>
                    <Button variant="contained" component={NavLink} to={`/home/${food.id}`} sx={{ padding: "0.5rem 2rem" }}>
                      View Details
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      width: "30%",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      borderRadius: "10px",
                      backgroundColor: "#EF4444",
                      color: "white",
                      marginBottom: "1rem",
                      padding: "0.4rem 1rem",
                      cursor: "pointer",
                      fontSize: "medium",
                      textDecoration: "none",
                      gap: "0.5rem",
                    }}
                  >
                    <CookingPot onClick={() => handleDelete(food.id)} />
                    {food.quantity}
                    <Plus onClick={() => handleAdd(food)} />
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center", color: "black", borderRadius: "10px" }}>
            <Typography variant="h4">Your Recipes Cart is empty</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AddToCart;

import { NavLink, useNavigate } from "react-router-dom";
import { CookingPot } from "lucide-react";
import { Plus } from "lucide-react";
import { addCart, deleteCart } from "../Redux/CartSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import type { Recipe } from "../Redux/RecipesSlice";
import { Box, Button, Typography } from "@mui/material";

const AddToCart = () => {
  const { items } = useAppSelector((state) => state.foodCart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  function handleDelete(id: number) {
    dispatch(deleteCart(id));
  }

  function handleAdd(foodItem: Recipe) {
    dispatch(addCart(foodItem));
  }

  return (
    <Box sx={{ padding:"32px" }}>
      <Box
        sx={{
          width: "96%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill , minmax(300px , 1fr))",
          gap: "16px",
        }}
      >
        {items.length > 0 && (
          items.map((food) => (
            <Box
              sx={{
                margin: "auto",
                border: "2px solid black",
                borderRadius: "10px",
                textAlign: "center",
                padding: "16px",
              }}
              key={food.id}
            >
              <Box
                component="img"
                style={{
                  width: "100%",
                  height: "auto",
                  border: "1px solid black",
                  borderRadius: "10px",
                  marginTop: "14px",
                }}
                src={food.image}
                alt={food.name}
              />
              <Box sx={{ color: "var(--jetGray)", fontSize: "large", fontWeight: "bold" }}>
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

                <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "16px", gap: "16px" }}>
                  <Box>
                    <Button
                      variant="contained"
                      component={NavLink}
                      to={`/home/${food.id}`}
                      sx={{ padding: "6px 16px" , backgroundColor:"var(--softCrimson)" }}
                    >
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
                      backgroundColor: "var(--softCrimson)",
                      color: "white",
                      marginBottom: "16px",
                      padding: "6px 16px",
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
        )}
      </Box>

      {items.length <= 0 && (
        <Box
            sx={{
              width:"100%",
              height: "90vh",
              display: "flex",
              flexDirection:"column",
              gap:"20px",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--jetGray)",
              borderRadius: "10px"
            }}
          >
            <Typography variant="h4">Your Recipes Cart is empty</Typography>
            <Button variant="contained" onClick={()=> navigate("/menu")}   sx={{backgroundColor:"var(--softCrimson)"}}>Explore Recipes</Button>
          </Box>
      )}
    </Box>
  );
};

export default AddToCart;

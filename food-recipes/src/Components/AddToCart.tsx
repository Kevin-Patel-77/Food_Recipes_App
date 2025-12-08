import { AnimatePresence, motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { CookingPot} from 'lucide-react';
import { Plus } from 'lucide-react';
import { addCart, deleteCart } from './Redux/CartReducers';
import { useAppDispatch, useAppSelector } from './hooks';
import type { Recipe } from './Redux/RecipesReducer';
import { Box, Button, Typography } from '@mui/material';

const MotionBox = motion(Box)
const MotionImg = motion("img");



const AddToCart = () => {
  const { items } = useAppSelector((state) => state.foodCart)
  const dispatch = useAppDispatch()

  const hoverEffect = {
    scale: 1.1,
    transition: { type: "spring" as const, stiffness: 500, mass: 2 }
  };

  function handleDelete(id:number) {
    dispatch(deleteCart(id))
  }

  function handleAdd(foodItem:Recipe) {
    dispatch(addCart(foodItem))
  }

  return (
    <Box sx={{padding:"1rem"}} >
      <Box sx={{ width: "96%", display: "grid", gridTemplateColumns: "repeat(auto-fit , minmax(300px , 1fr))", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
        <AnimatePresence>
          {items.length > 0 ? items.map((food) => (
            <MotionBox
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 1, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              sx={{ margin: "auto", border: "2px solid black", borderRadius: "10px", textAlign: "center", padding: "1rem" }}
              key={food.id}>
              <MotionImg style={{ width: "100%", height: "20rem", border: "1px solid black", borderRadius: "10px", marginTop: "0.8rem" }} whileHover={hoverEffect} src={food.image} alt={food.name} />
              <Box sx={{ color: "white", fontSize: "large", fontWeight: "bold" }}>
                <Typography variant='body1' sx={{ marginTop: "1rem" }}>Name: {food.name}</Typography>
                <Typography variant='body1' sx={{ marginBottom: "1rem" }}>Meal Type: {food.mealType.map((meal, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ marginRight: "0.5rem" }}
                  >
                    {meal}
                  </Box>
                ))}</Typography>


                <Box sx={{display:"flex" , justifyContent:"center" , marginBottom:"1rem" , gap:"1rem"}}>
                  <MotionBox whileHover={hoverEffect} >
                    <Button component={NavLink} to={`/food/${food.id}`} sx={{padding:"0.5rem 2rem"}}>View Details</Button>
                  </MotionBox>

                  <MotionBox whileHover={hoverEffect} sx={{width:"30%" , display:"flex" , 
                    justifyContent:"space-evenly" , alignItems:"center" , 
                    border:"1px solid black" , borderRadius:"10px" , 
                    backgroundColor:"black" , color:"gold" , marginBottom:"1rem" , 
                    padding:"0.4rem 1rem" , cursor:"pointer" , fontWeight:"bolder" , 
                    fontSize:"medium" , textDecoration:"none", gap:"0.5rem" }} >

                    <CookingPot onClick={() => handleDelete(food.id)} />
                    {food.quantity}
                    <Plus onClick={() => handleAdd(food)} />   
                  </MotionBox>

                </Box>
              </Box>
            </MotionBox>
          )) : <MotionBox sx={{ textAlign: "center", color: "white", backgroundColor: "#ff6f00", borderRadius: "10px" }} initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}>
            <Typography  variant='h4'>Your Recipes Cart is empty</Typography>
          </MotionBox>}
        </AnimatePresence>
      </Box>
    </Box>
  )
}

export default AddToCart


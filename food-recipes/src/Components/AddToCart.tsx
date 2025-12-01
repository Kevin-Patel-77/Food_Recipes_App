import { AnimatePresence, motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { CookingPot} from 'lucide-react';
import { Plus } from 'lucide-react';
import { addCart, deleteCart } from './Redux/CartReducers';
import { useAppDispatch, useAppSelector } from './hooks';
import type { Recipe } from './Redux/RecipesReducer';


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
    <div className='food-recipes'>
      <div className='food-info'>
        <AnimatePresence>
          {items.length > 0 ? items.map((food) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 1, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className='Cart-food-box'
              key={food.id}>
              <motion.img whileHover={hoverEffect} src={food.image} alt={food.name} />
              <div className='food-names'>
                <p>Name: {food.name}</p>
                <p>Meal Type: {food.mealType.map((meal , index ) => <span key={index} style={{ marginRight: "0.5rem" }}>{meal}</span>)}</p>
                <div className='details'>
                  <motion.div whileHover={hoverEffect} >
                    <NavLink to={`/food/${food.id}`} className="btn">View Details</NavLink>
                  </motion.div>

                  <motion.div className='cartCount' whileHover={hoverEffect} >
                    <CookingPot onClick={() => handleDelete(food.id)} />
                    {food.quantity}
                    <Plus onClick={() => handleAdd(food)} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )) : <motion.div style={{textAlign:"center" ,  border:"2px solid black", color:"gold" , backgroundColor:"black" , borderRadius:"10px"}} initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}>
            <h1>Your Recipes Cart is empty</h1>
          </motion.div>}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AddToCart


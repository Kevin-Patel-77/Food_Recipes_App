import { useEffect, useState } from "react"
import { fetchRecipes, type Recipe } from "./Redux/RecipesReducer"
import { ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "./hooks"
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { increasePage } from "./Redux/RecipesReducer";

const Dashboard = () => {
   const dispatch = useAppDispatch()
   const [filteredData, setFilteredData] = useState<Recipe[]>([])
   const { recipes, loading, error, page, hasMore } = useAppSelector((state) => state.foodrecipes)

   const hoverEffect = {
      scale: 1.1,
      transition: { type: "spring" as const, stiffness: 500, mass: 2 }
   };

   function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      let filterData = recipes.filter((meal) => (
         meal.mealType.some((type) => type.toLowerCase().includes(event.target.value.toLowerCase())) ||
         meal.name.toLowerCase().includes(event.target.value.toLowerCase())
      ))
      setFilteredData(filterData)
   }

   useEffect(() => {
      if (recipes.length > 0) {
         setFilteredData(recipes)
      }
   }, [recipes])

   useEffect(() => {
      dispatch(fetchRecipes(page))
   }, [page])


   useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !loading && hasMore) {
                dispatch(increasePage());
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);
    

   if (error) {
      return <div style={{ fontSize: "5rem", display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(10px)", height: "100vh" }} >{error}</div>
   }


   return (
      <div>
         <div className='food-recipes'>
            <div className='search-food'>
               <input type="search" onChange={handleChange} placeholder='Which Type of meal you want' />
               <motion.div className='Authentication'>
                  <motion.div whileHover={hoverEffect}>
                     {/* <NavLink to="/cart" className='cart'>Cart{count > 0 ? `(${count})` : ""}<ShoppingCart size={25} /></NavLink> */}
                  </motion.div>

                  <motion.div whileHover={hoverEffect}>
                     <NavLink to="/signup" className='cart'>Signup</NavLink>
                  </motion.div>

                  <motion.div whileHover={hoverEffect}>
                     <NavLink to="/login" className='cart'>Login</NavLink>
                  </motion.div>
                  <motion.div whileHover={hoverEffect}>
                     {/* <button onClick={handleLogout} className='cart'>Logout</button> */}
                  </motion.div>
               </motion.div>
            </div>
 
            <div className='food-info'>
               <AnimatePresence>
                  {filteredData.map((food) => (
                     <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className='food-box'
                        key={food.id}>
                        <motion.img whileHover={hoverEffect} src={food.image} alt={food.name} />
                        <div className='food-names'>
                           <p>Name: {food.name}</p>
                           <p>Meal Type: {food.mealType.map((meal, index) => <span key={index} style={{ marginRight: "0.5rem" }}>{meal}</span>)}</p>
                           <div className='details'>
                              <motion.div whileHover={hoverEffect} >
                                 <NavLink to={`/food/${food.id}`} className="btn">View Details</NavLink>
                              </motion.div>

                              <motion.div whileHover={hoverEffect} >
                                 <button className="btn">Add to Cart</button>
                                 {/* onClick={() => handleCart(food)} */}
                              </motion.div>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>

               {loading && (
                  <p style={{ textAlign: "center", padding: "20px", fontSize: "2rem" }}>
                     Loading...
                  </p>
               )}
            </div>

            {/* <div className='pagination'>
                   <div>
                    <button disabled={currentPage === 1} onClick={handlePrev} className='pagination-btn'>Prev</button>
                   </div>

                     <div>
                        {Array.from({length:totalPages} , (_,i) => (
                            <button 
                            style={{ border:"1px solid black" , borderRadius:"10px" ,margin: "0rem 0.5rem", padding:"0.5rem 1rem" , color:currentPage == i+1 ? "black" : "gold" , backgroundColor:currentPage == i+1 ? "gold" : "black"} }
                            onClick={()=>setCurrentPage(i+1)}>
                                {i + 1}
                            </button>
                        ))}
                     </div>
                     
                   <div>
                    <button  disabled={currentPage === totalPages} className='pagination-btn' onClick={handleNext}>Next</button>
                   </div>
                </div> */}
         </div>
      </div >
   )
}

export default Dashboard

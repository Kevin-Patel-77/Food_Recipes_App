import { useEffect, useRef, useState } from "react";
import { fetchRecipes } from "./Redux/RecipesReducer";
import type { Recipe } from "./Redux/RecipesReducer";
import { useAppDispatch, useAppSelector, useAuthSelector } from "./hooks";
import { NavLink, useNavigate } from "react-router-dom";
import { addCart } from "./Redux/CartReducers";
import { AnimatePresence, motion } from "framer-motion";
import { increasePage } from "./Redux/RecipesReducer";
import { logout } from "./Redux/AuthReducer";
import RecipeSkeleton from "./RecipeSkeleton";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { debounce } from "lodash";
import { toast } from "react-toastify";

const MotionBox = motion.create(Box);
const MotionImg = motion("img");

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filteredData, setFilteredData] = useState<Recipe[]>([]);
  const { recipes, loading, error, page, hasMore } = useAppSelector(
    (state) => state.foodrecipes
  );
  const { isLogin } = useAuthSelector((state) => state.foodAuth);
  const { count } = useAppSelector((state) => state.foodCart);
  const itemsPerPage: number = 8;
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [filterByAmount, setFilterByAmount] = useState([]);

  const debouncing = useRef<
    (((value: Recipe[]) => void) & { cancel: () => void }) | null
  >(null);

  const hoverEffect = {
    scale: 1.1,
    transition: { type: "spring" as const, stiffness: 500, mass: 2 },
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value.trim();

    if (value.length > 0) {
      setIsSearching(true);
      setHasSearched(true);
    } else {
      setIsSearching(false);
      setFilteredData(recipes);
      return;
    }

    let filterData = recipes.filter(
      (meal) =>
        meal.mealType.some((type) =>
          type.toLowerCase().includes(value.toLowerCase())
        ) || meal.name.toLowerCase().includes(value.toLowerCase())
    );

    if (filterData.length === 0) {
      debouncing.current?.([]);
    } else {
      debouncing.current?.(filterData);
    }
  }

  function handleCart(foodItem: Recipe) {
    dispatch(addCart(foodItem));
  }

  function SortingChange(event: SelectChangeEvent) {
    if (event.target.value === "") {
      setFilterByAmount([]);
    } else {
      const amount = JSON.parse(event.target.value);
      setFilterByAmount(amount);
    }
  }

  function handleLogout() {
    dispatch(logout());
    toast.success("Logout Successful");
  }

  useEffect(() => {
    debouncing.current = debounce((value: Recipe[]) => {
      setFilteredData(value);
    }, 500);

    return () => debouncing.current?.cancel();
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      setFilteredData(recipes);
    }
  }, [recipes]);

  useEffect(() => {
    dispatch(fetchRecipes({ page, limit: itemsPerPage }));
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (isSearching) return;

      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 10 &&
        !loading &&
        hasMore
      ) {
        dispatch(increasePage());
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isSearching, hasMore]);

  useEffect(() => {
    if (filterByAmount.length > 0) {
      const sortAmt: Recipe[] = recipes.filter(
        (food) =>
          food.amount > filterByAmount[0] && food.amount <= filterByAmount[1]
      );

      setFilteredData(sortAmt);
    }

    if (filterByAmount.length == 0) {
      setFilteredData(recipes);
    }
  }, [filterByAmount]);

  if (error) {
    return (
      <div
        style={{
          fontSize: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(10px)",
          height: "100vh",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <Box>
      <Box>
        <Box
          sx={{
            marginTop: "3rem",
            marginBottom: "1.5rem",
            display: { xs: "grid", sm: "grid", md: "flex" },
            justifyContent: { xs: "space-evenly", sm: "space-evenly" },
            alignItems: "center",
            gap: { xs: "1rem", sm: "1rem" },
          }}
        >
          <TextField
            type="search"
            sx={{
              width: { sm: "100%", md: "70%" },
              "& .MuiInputBase-input": { textAlign: "center" },
            }}
            onChange={handleChange}
            placeholder="Which Type of meal you want"
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isLogin ? "0.5rem" : "1rem",
            }}
          >
            <Box>
              {isLogin && (
                <Select
                  value={JSON.stringify(filterByAmount)}
                  onChange={SortingChange}
                  renderValue={(selected) => {
                    if (selected === "[]") {
                      return <em>Filter By Amt</em>;
                    }
                    return selected;
                  }}
                  sx={{
                    width: "12rem",

                    "& .MuiSelect-select": {
                      padding: "0.4rem 1.5rem",
                      color: "#ff6f00",
                    },

                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },

                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "lightgray",
                      },
                  }}
                >
                  <MenuItem value="">
                    <em>Filter By Amt</em>
                  </MenuItem>
                  <MenuItem value={"[0 , 200]"}>Up to 300</MenuItem>
                  <MenuItem value={"[301 , 600]"}>301 to 600</MenuItem>
                  <MenuItem value={"[601 , 900]"}>600 to 900</MenuItem>
                  <MenuItem value={"[901 , 1000]"}>901 to 1000</MenuItem>
                </Select>
              )}
            </Box>

            <MotionBox whileHover={hoverEffect}>
              <Button
                component={NavLink}
                to="/cart"
                variant="contained"
                sx={{ backgroundColor: "ff8c00", color: "#fff" }}
              >
                Cart{count > 0 ? `(${count})` : ""}
              </Button>
            </MotionBox>

            <MotionBox whileHover={hoverEffect}>
              {!isLogin && (
                <Button
                  component={NavLink}
                  to="/signup"
                  variant="contained"
                  sx={{ backgroundColor: "ff8c00", color: "#fff" }}
                >
                  Signup
                </Button>
              )}
            </MotionBox>

            <MotionBox whileHover={hoverEffect}>
              {!isLogin && (
                <Button
                  component={NavLink}
                  to="/login"
                  variant="contained"
                  sx={{ backgroundColor: "ff8c00", color: "#fff" }}
                >
                  Login
                </Button>
              )}
            </MotionBox>

            <MotionBox whileHover={hoverEffect}>
              {isLogin && (
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  sx={{ backgroundColor: "ff8c00", color: "#fff" }}
                >
                  Logout
                </Button>
              )}
            </MotionBox>
          </Box>
        </Box>

        <Box
          sx={{
            width: "96%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit , minmax(350px , 1fr))",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatePresence>
            {filteredData.length === 0 && !loading && hasSearched ? (
              <Typography
                variant="h4"
                sx={{ textAlign: "center", color: "black", padding: "2rem" }}
              >
                No Data Found
              </Typography>
            ) : (
              filteredData.map((food) => (
                <MotionBox
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    width: "90%",
                    margin: "auto",
                    border: "2px solid black",
                    borderRadius: "10px",
                    textAlign: "center",
                    padding: "1rem",
                  }}
                  key={food.id}
                >
                  <MotionImg
                    style={{
                      width: "100%",
                      height: "20rem",
                      border: "1px solid black",
                      borderRadius: "10px",
                      marginTop: "0.8rem",
                      marginBottom: "1rem",
                    }}
                    onClick={() => navigate(`/food/${food.id}`)}
                    whileHover={hoverEffect}
                    src={food.image}
                    alt={food.name}
                  ></MotionImg>

                  <Box
                    sx={{
                      color: "white",
                      fontSize: "large",
                      fontWeight: "bold",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      textAlign: "left",
                    }}
                  >
                    <Tooltip
                      title={food.name}
                      placement="right"
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: "#ff6f00",
                            fontSize: "small",
                          },
                        },
                        arrow: {
                          sx: {
                            color: "#ff6f00",
                          },
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "black",
                          maxWidth: "150px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        Name: {food.name}
                      </Typography>
                    </Tooltip>

                    {isLogin && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: "black",
                          maxWidth: "150px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        Amount: {food.amount}
                      </Typography>
                    )}

                    <Typography
                      variant="body1"
                      sx={{ marginBottom: "1rem", color: "black" }}
                    >
                      Meal Type:{" "}
                      {food.mealType.map((meal, index) => (
                        <Typography
                          key={index}
                          component="span"
                          sx={{ marginRight: "0.5rem" }}
                        >
                          {meal}
                        </Typography>
                      ))}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <MotionBox whileHover={hoverEffect}>
                        <Button
                          component={NavLink}
                          to={`/food/${food.id}`}
                          variant="contained"
                        >
                          View Details
                        </Button>
                      </MotionBox>

                      <MotionBox whileHover={hoverEffect}>
                        <Button
                          type="button"
                          onClick={() => handleCart(food)}
                          variant="contained"
                        >
                          Add to Cart
                        </Button>
                      </MotionBox>
                    </Box>
                  </Box>
                </MotionBox>
              ))
            )}
          </AnimatePresence>

          {loading &&
            Array.from({ length: itemsPerPage }).map((_, i) => (
              <MotionBox
                key={`skeleton-${i}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <RecipeSkeleton />
              </MotionBox>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

// Pagination
// const [currentPage , setCurrentPage] = useState(1)
// const itemsPerPage = 6

// const lastIndex = currentPage * itemsPerPage
// const firstIndex = lastIndex - itemsPerPage

// const currentItem = filteredData.slice(firstIndex , lastIndex)

// const totalPages = Math.ceil(filteredData.length / itemsPerPage)

// function handlePrev(){
//     setCurrentPage((prev)=> prev - 1)
// }

// function handleNext(){
//     setCurrentPage((prev) => prev + 1)
// }

/* <div className='pagination'>
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
</div> */

// Navigator State

//  const location = useLocation();
//   console.log(location.state.greetings);

//  navigate("/food" , {
//         state : {greetings : "Heyyy Bro"}
//       });

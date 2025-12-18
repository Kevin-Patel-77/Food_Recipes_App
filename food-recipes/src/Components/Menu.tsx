import { Box, Button, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector, useDebounce } from "./hooks";
import { useEffect, useState } from "react";
import { fetchRecipes, increasePage, type Recipe } from "./Redux/RecipesReducer";
import RecipeSkeleton from "./RecipeSkeleton";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { addCart } from "./Redux/CartReducers";
import search from "../assets/search.png";
import rupee from "../assets/rupee.png";

const Menu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [filteredData, setFiltereddata] = useState<Recipe[]>([]);
  const { recipes, loading, error, page, hasMore } = useAppSelector((state) => state.foodrecipes);
  const itemsPerPage = 6;
  const [params, setParams] = useSearchParams();
  const [searchItem, setSearchItem] = useState(params.get("searchquery") || "");
  const debounceSearch = useDebounce(searchItem, 500);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchItem(event.target.value);

    if (event.target.value.trim() === "") {
      setIsSearching(false);
      setHasSearched(false);
    } else {
      setIsSearching(true);
    }
  }

  //   Add To Cart
  function handleCart(foodItem: Recipe) {
    dispatch(addCart(foodItem));
  }

  useEffect(() => {
    dispatch(fetchRecipes({ page, limit: itemsPerPage }));
  }, [page]);

  useEffect(() => {
    if (searchItem) {
      setParams({ searchquery: searchItem });
    } else {
      setParams({});
    }
  }, [searchItem]);

  useEffect(() => {
    if (recipes.length === 0) return;

    if (!debounceSearch.trim()) {
      setFiltereddata(recipes);

      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    const filtered = recipes.filter(
      (meal) =>
        meal.mealType.some((type) => type.toLowerCase().includes(debounceSearch.toLowerCase())) ||
        meal.name.toLowerCase().includes(debounceSearch.toLowerCase())
    );

    setFiltereddata(filtered);
    setHasSearched(true);
  }, [debounceSearch, recipes]);

  useEffect(() => {
    const handleScroll = () => {
      if (isSearching) return;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !loading && hasMore) {
        dispatch(increasePage());
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isSearching ,  hasMore , dispatch]);

  // Error
  if (error) {
    return (
      <Box
        sx={{
          fontSize: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(10px)",
          height: "100vh",
        }}
      >
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "20%", height: "80vh", border: "1px solid #333333", borderRadius: "12px", padding: "1rem" }}>
          <Typography variant="h4" color="primary" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Menu
          </Typography>

          <Box sx={{ marginTop: "3rem" }}>
            <TextField
              type="search"
              value={searchItem}
              fullWidth
              placeholder="Search for dish or a meal type "
              onChange={handleSearchChange}
              sx={{
                "& .MuiInputBase-root": {
                  height: "2rem",
                  borderRadius: "5px",
                  backgroundColor: "white",
                  paddingRight: "0.5rem",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      component="img"
                      src={search}
                      sx={{
                        width: "1.5rem",
                        height: "1.5rem",
                        objectFit: "contain",
                      }}
                    ></Box>
                  </InputAdornment>
                ),
              }}
            ></TextField>
          </Box>
        </Box>

        <Box
          sx={{
            width: "80%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit , minmax(400px , 1fr))",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading &&
            Array.from({ length: itemsPerPage }).map((_, i) => (
              <Box key={`skeleton-${i}`}>
                <RecipeSkeleton />
              </Box>
            ))}

          {!loading && filteredData.length === 0 && hasSearched ? (
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                color: "black",
                padding: "2rem",
              }}
            >
              No Data Found
            </Typography>
          ) : (
            filteredData.map((food) => (
              <Box
                sx={{
                  width: "90%",
                  margin: "auto",
                  border: "1px solid #333333",
                  borderRadius: "10px",
                  textAlign: "center",
                  padding: "1rem",
                }}
                key={food.id}
              >
                <Box
                  component="img"
                  sx={{
                    width: "100%",
                    height: "20rem",
                    border: "1px solid black",
                    borderRadius: "10px",
                    marginTop: "0.8rem",
                    marginBottom: "1rem",
                  }}
                  onClick={() => navigate(`/food/${food.id}`)}
                  src={food.image}
                  alt={food.name}
                ></Box>

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
                          backgroundColor: "#EF4444",
                          fontSize: "small",
                        },
                      },
                      arrow: {
                        sx: {
                          color: "#EF4444",
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
                    Amount: <Box component="img" src={rupee} width="0.9rem" height="1.2vh"></Box>
                    {food.amount}
                  </Typography>

                  <Typography variant="body1" sx={{ marginBottom: "1rem", color: "black" }}>
                    Meal Type:{" "}
                    {food.mealType.map((meal, index) => (
                      <Typography key={index} component="span" sx={{ marginRight: "0.5rem" }}>
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
                    <Box>
                      <Button component={NavLink} to={`/home/${food.id}`} variant="contained">
                        View Details
                      </Button>
                    </Box>

                    <Box>
                      <Button type="button" onClick={() => handleCart(food)} variant="contained">
                        Add to Cart
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Menu;

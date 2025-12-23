import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useRef, useState } from "react";
import { fetchRecipes, increasePage, type Recipe } from "./Redux/RecipesReducer";
import RecipeSkeleton from "./RecipeSkeleton";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { addCart } from "./Redux/CartReducers";
import search from "../assets/search.png";
import rupee from "../assets/rupee.png";
import { debounce } from "lodash";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";

const Menu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [filteredData, setFiltereddata] = useState<Recipe[]>([]);
  const { recipes, loading, error, page, hasMore } = useAppSelector((state) => state.foodrecipes);
  const [params, setParams] = useSearchParams();
  const [searchItem, setSearchItem] = useState(params.get("searchquery") || "");
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([]);

  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [isListView, setIsListView] = useState<boolean>(() => {
    const saved = localStorage.getItem("listToggle");

    if (saved === null || saved === "undefined") {
      return false;
    }
    return JSON.parse(saved);
  });

  const itemsPerPage = 10;

  const debouncing = useRef<(((value: string, cuisineArr: string[], amountRange: number[]) => void) & { cancel: () => void }) | null>(null);

  const cuisines = ["Indian", "Italian", "Mexican", "Mediterranean", "Pakistani", "Japanese", "Russian", "Korean", "Greek"];

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchItem(event.target.value);

    if (event.target.value.trim() === "") {
      setIsSearching(false);
      setHasSearched(false);
    } else {
      setIsSearching(true);
    }
  }

  // Checkbox

  function handleCuisineChange(value: string, checked: boolean) {
    if (checked) {
      setCuisine((prev) => [...prev, value]);
    } else {
      setCuisine((prev) => prev.filter((item) => item !== value));
    }
  }

  function handleChipDelete(cuis: string) {
    setCuisine((prev) => prev.filter((item) => item !== cuis));
  }

  // Price Range

  function handlePriceChange(_event: Event, newValue: number | number[]) {
    setPriceRange(newValue as number[]);
  }

  // Clear All

  function handleClearAll() {
    setSearchItem("");
    setCuisine([]);
    setPriceRange([]);
  }

  //   Add To Cart
  function handleCart(foodItem: Recipe) {
    dispatch(addCart(foodItem));
  }

  // List and Grid View

  function handleListAndGridView() {
    setIsListView((prev) => !prev);
  }

  useEffect(() => {
    localStorage.setItem("listToggle", JSON.stringify(isListView));
  }, [isListView]);

  useEffect(() => {
    dispatch(fetchRecipes({ page, limit: itemsPerPage }));
  }, [page]);

  useEffect(() => {
    if (recipes.length > 0 && !searchItem.trim()) {
      setFiltereddata(recipes);
    }
  }, [recipes]);

  useEffect(() => {
    if (!debouncing.current) return;
    debouncing.current(searchItem, cuisine, priceRange);
  }, [searchItem, cuisine, priceRange]);

  useEffect(() => {
    setIsSearching(searchItem.trim() !== "" || cuisine.length > 0 || priceRange.length > 0);
  }, [searchItem, cuisine, priceRange]);

  useEffect(() => {
    const cuisineFromUrl = params.get("cuisine");

    if (cuisineFromUrl) {
      setCuisine(cuisineFromUrl.split(","));
    }
  }, []);

  useEffect(() => {
    const priceFromUrl = params.get("price");

    if (priceFromUrl) {
      const [min, max] = priceFromUrl.split("-").map(Number);
      setPriceRange([min, max]);
    }
  }, []);

  useEffect(() => {
    const newParams: any = {};

    if (searchItem.trim()) {
      newParams.searchquery = searchItem;
    }
    if (cuisine.length > 0) {
      newParams.cuisine = cuisine.join(",");
    }

    if (priceRange.length > 0) {
      newParams.price = `${priceRange[0]}-${priceRange[1]}`;
    }

    setParams(newParams);
  }, [cuisine, searchItem, priceRange]);

  useEffect(() => {
    debouncing.current = debounce((value: string, cuisineArr: string[], amountRange: number[]) => {
      const [min, max] = amountRange;

      if (!value.trim() && cuisineArr.length === 0 && amountRange.length === 0) {
        setFiltereddata(recipes);
        setHasSearched(false);
        return;
      }

      const filtered = recipes.filter((meal) => {
        const searchMatch =
          !value.trim() ||
          meal.name.toLowerCase().includes(value.toLowerCase()) ||
          meal.mealType.some((type) => type.toLowerCase().includes(value.toLowerCase()));

        const cuisineMatch = cuisineArr.length === 0 || cuisineArr.includes(meal.cuisine);

        const priceMatch = amountRange.length === 0 || (meal.amount >= min && meal.amount <= max);

        return searchMatch && cuisineMatch && priceMatch;
      });

      setFiltereddata(filtered);
      setHasSearched(searchItem.trim() !== "" || cuisineArr.length > 0 || amountRange.length > 0);
    }, 500);

    return () => {
      debouncing.current?.cancel();
    };
  }, [recipes, cuisine, searchItem, priceRange]);

  useEffect(() => {
    const handleScroll = () => {
      if (isSearching || loading) return;

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !loading && hasMore) {
        dispatch(increasePage());
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isSearching, hasMore, dispatch]);

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
    <Box sx={{ padding: "35px" }}>
      <Box sx={{ display: { sm: "grid", md: "flex", lg: "flex" }, gap: "20px" }}>
        <Box
          sx={{ width: { sm: "100%", md: "50%", lg: "20%" }, height: "1100px", border: "1px solid #333333", borderRadius: "12px", padding: "1rem" }}
        >
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

          <Box sx={{ marginTop: "20px" }}>
            {cuisine.length > 0 && cuisine.map((item) => <Chip key={item} label={item} variant="outlined" onDelete={() => handleChipDelete(item)} />)}
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "end", justifyContent: "space-between" }}>
              <Typography variant="h5" color="primary" sx={{ marginTop: "30px", fontWeight: "bold" }}>
                Cuisine
              </Typography>

              {searchItem.trim() || cuisine.length > 0 || priceRange.length > 0 ? (
                <Button variant="text" onClick={handleClearAll}>
                  Clear All
                </Button>
              ) : (
                ""
              )}
            </Box>
            <hr />

            <Box>
              <FormGroup>
                {cuisines.map((cuis) => (
                  <FormControlLabel
                    key={cuis}
                    label={cuis}
                    control={<Checkbox size="small" checked={cuisine.includes(cuis)} onChange={(e) => handleCuisineChange(cuis, e.target.checked)} />}
                  />
                ))}
              </FormGroup>
            </Box>
          </Box>

          <Box>
            <Typography variant="h5" color="primary" sx={{ marginTop: "20px", fontWeight: "bold" }}>
              Price
            </Typography>
            <hr />

            <Box>
              <Typography gutterBottom>{priceRange.length > 0 ? `Amount: ₹${priceRange[0]} - ₹${priceRange[1]}` : `Amount: ₹0 - ₹1000`}</Typography>
              <Slider
                value={priceRange.length ? priceRange : [0, 1000]}
                onChange={handlePriceChange}
                min={0}
                max={1000}
                step={10}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="h5" color="primary" sx={{ marginTop: "20px", fontWeight: "bold" }}>
              Layout
            </Typography>
            <hr />

            {isListView ? (
              <Button
                variant="contained"
                onClick={handleListAndGridView}
                sx={{ gap: "10px", border: "1px solid red", borderRadius: "100px", padding: "5px 30px" }}
              >
                <FormatListBulletedIcon />
                <Typography variant="h6">List</Typography>
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleListAndGridView}
                sx={{ gap: "10px", border: "1px solid red", borderRadius: "100px", padding: "5px 30px" }}
              >
                <GridViewIcon />
                <Typography variant="h6">Grid</Typography>
              </Button>
            )}
          </Box>
        </Box>

        {isListView ? (
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "80%", lg: "80%" }, border: "1px solid #333333", borderRadius: "12px" }}>
            {/* Loading Data */}
            {loading && filteredData.length === 0 && Array.from({ length: itemsPerPage }).map((_, i) => <RecipeSkeleton key={`init-${i}`} />)}

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
              <Box sx={{ marginTop: { xs: "20px", sm: "20px" } }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ borderBottom: "1px solid black", fontWeight: "bold", fontSize: "20px" }}>Name</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid black", fontWeight: "bold", fontSize: "20px" }} align="right">
                          Amount
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid black", fontWeight: "bold", fontSize: "20px" }} align="right">
                          Meal Type
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid black", fontWeight: "bold", fontSize: "20px" }} align="right">
                          View Details
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid black", fontWeight: "bold", fontSize: "20px" }} align="right">
                          Add To Cart
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredData.map((food) => (
                        <TableRow key={food.id}>
                          <TableCell sx={{ padding: "30px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "18px" }}>
                            <Box
                              component="img"
                              sx={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", cursor: "pointer" }}
                              onClick={() => navigate(`/home/${food.id}`)}
                              src={food.image}
                              alt={food.name}
                            ></Box>
                            {food.name}
                          </TableCell>

                          <TableCell align="right" sx={{ fontSize: "18px" }}>
                            <Box component="img" src={rupee} width="18px" height="12px"></Box>
                            {food.amount}
                          </TableCell>
                          <TableCell align="right">
                            {food.mealType.map((meal, index) => (
                              <Typography key={index} sx={{ fontSize: "18px" }}>
                                {meal}
                              </Typography>
                            ))}
                          </TableCell>
                          <TableCell align="right">
                            <Button component={NavLink} to={`/home/${food.id}`} variant="contained" size="small" sx={{ padding: "5px 10px" }}>
                              View Details
                            </Button>
                          </TableCell>

                          <TableCell align="right">
                            <Button type="button" onClick={() => handleCart(food)} variant="contained" size="small" sx={{ padding: "5px 10px" }}>
                              Add to Cart
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {loading &&
              filteredData.length > 0 &&
              !isSearching &&
              Array.from({ length: itemsPerPage }).map((_, i) => <RecipeSkeleton key={`more-${i}`} />)}
          </Box>
        ) : (
          <Box
            sx={{
              width: { xs: "100%", sm: "100%", md: "80%", lg: "80%" },
              display: "grid",
              gridTemplateColumns: { sm: "repeat(2 , 1fr)", md: "repeat(auto-fill, 450px)", lg: "repeat(auto-fill, 450px)" },
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              marginTop: { xs: "20px", sm: "20px" },
            }}
          >
            {/* Loading Data */}
            {loading && filteredData.length === 0 && Array.from({ length: itemsPerPage }).map((_, i) => <RecipeSkeleton key={`init-${i}`} />)}

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
                    onClick={() => navigate(`/home/${food.id}`)}
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
                      Amount: <Box component="img" src={rupee} width="15px" height="12px"></Box>
                      {food.amount}
                    </Typography>

                    <Typography variant="body1" sx={{ marginBottom: "16px", color: "black" }}>
                      Meal Type:{" "}
                      {food.mealType.map((meal, index) => (
                        <Typography key={index} component="span" sx={{ marginRight: "8px" }}>
                          {meal}
                        </Typography>
                      ))}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        gap: "16px",
                        justifyContent: "center",
                        marginBottom: "16px",
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

            {loading &&
              filteredData.length > 0 &&
              !isSearching &&
              Array.from({ length: itemsPerPage }).map((_, i) => <RecipeSkeleton key={`more-${i}`} />)}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Menu;

// Italian
// Asian
// American
// Mexican
// Mediterranean
// Pakistani
// Japanese
// Korean
// Greek
// Thai
// Turkish
// Smoothie
// Russian
// Indian
// Lebanese
// Brazilian
// Hawaiian
// Cocktail
// Moroccan
// Vietnamese
// Spanish

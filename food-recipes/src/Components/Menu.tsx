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
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchRecipes, increasePage, type Recipe } from "../Redux/RecipesSlice";
import RecipeSkeleton from "./RecipeSkeleton";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import search from "../assets/search.png";
import rupee from "../assets/rupee.png";
import { debounce } from "lodash";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { toast } from "react-toastify";
import { addToCartServer } from "../Redux/Cart/CartThunk"

const tabelCell = {
  borderBottom: "1px solid black",
  fontWeight: "bold",
  fontSize: "20px",
};

const Menu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { recipes, loading, error, page, hasMore } = useAppSelector((state) => state.foodrecipes);
  const [params, setParams] = useSearchParams();
  const [searchItem, setSearchItem] = useState(params.get("searchquery") || "");
  const [debouncedValue, setDebouncedValue] = useState(searchItem);

  const [cuisine, setCuisine] = useState<string[]>(() => {
    const cuisineFromUrl = params.get("cuisine");
    return cuisineFromUrl ? cuisineFromUrl.split(",") : [];
  });

  const [priceRange, setPriceRange] = useState<number[]>(() => {
    const priceFromUrl = params.get("price");
    if (!priceFromUrl) return [];
    const [min, max] = priceFromUrl.split("-").map(Number);
    return [min, max];
  });

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setDebouncedValue(value);
    }, 500)
  );

  const hasSearched = debouncedValue.trim() !== "" || cuisine.length > 0 || priceRange.length > 0;

  const isSearching = debouncedValue.trim() !== "" || cuisine.length > 0 || priceRange.length > 0;

  const { items } = useAppSelector((state) => state.foodCart);

  const [isListView, setIsListView] = useState<boolean>(() => {
    const saved = localStorage.getItem("listToggle");

    if (saved === null || saved === "undefined") {
      return false;
    }
    return JSON.parse(saved);
  });

  const itemsPerPage = 10;

  const cuisines = [
    "Indian",
    "Italian",
    "Mexican",
    "Mediterranean",
    "Pakistani",
    "Japanese",
    "Russian",
    "Korean",
    "Greek",
  ];

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearchItem(value);

    debouncedSearch.current(value);
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
    dispatch(addToCartServer({...foodItem , quantity:1}))
    toast.success("Cart Added");
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
  }, [page, dispatch]);

  useEffect(() => {
    const newParams: { searchquery?: string; cuisine?: string; price?: string } = {};

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
  }, [cuisine, searchItem, priceRange, setParams]);

  const filteredData = useMemo(() => {
    if (recipes.length === 0) return [];

    return recipes.filter((meal) => {
      const searchMatch =
        !debouncedValue.trim() ||
        meal.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        meal.mealType.some((type) => type.toLowerCase().includes(debouncedValue.toLowerCase()));

      const cuisineMatch = cuisine.length === 0 || cuisine.includes(meal.cuisine);

      const priceMatch = priceRange.length === 0 || (meal.amount >= priceRange[0] && meal.amount <= priceRange[1]);

      return searchMatch && cuisineMatch && priceMatch;
    });
  }, [recipes, debouncedValue, cuisine, priceRange]);

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

  // Error (only when no cached data)
  if (error && recipes.length === 0) {
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
    <Box sx={{ padding: "30px" }}>
      <Box sx={{ display: { sm: "grid", md: "flex", lg: "flex" }, gap: "20px" }}>
        <Box
          sx={{
            width: { sm: "100%", md: "50%", lg: "20%" },
            height: "1100px",
            border: "1px solid var(--jetGray)",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <Typography variant="h4" sx={{ textAlign: "center", color: "var(--softCrimson)" }}>
            Menu
          </Typography>

          <Box sx={{ marginTop: "48px" }}>
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
            {cuisine.length > 0 &&
              cuisine.map((item) => (
                <Chip key={item} label={item} variant="outlined" onDelete={() => handleChipDelete(item)} />
              ))}
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "end", justifyContent: "space-between" }}>
              <Typography variant="h5" sx={{ marginTop: "30px", color: "var(--softCrimson)" }}>
                Cuisine
              </Typography>

              {searchItem.trim() || cuisine.length > 0 || priceRange.length > 0 ? (
                <Button variant="text" onClick={handleClearAll} sx={{ color: "var(--softCrimson)" }}>
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
                    control={
                      <Checkbox
                        size="small"
                        checked={cuisine.includes(cuis)}
                        onChange={(e) => handleCuisineChange(cuis, e.target.checked)}
                      />
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ marginTop: "20px", color: "var(--softCrimson)" }}>
              Price
            </Typography>
            <hr />

            <Box>
              <Typography gutterBottom>
                {priceRange.length > 0 ? `Amount: ₹${priceRange[0]} - ₹${priceRange[1]}` : `Amount: ₹0 - ₹1000`}
              </Typography>
              <Slider
                value={priceRange.length ? priceRange : [0, 1000]}
                onChange={handlePriceChange}
                min={0}
                max={1000}
                step={10}
                valueLabelDisplay="auto"
                sx={{ color: "var(--softCrimson)" }}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ marginTop: "20px", color: "var(--softCrimson)" }}>
              Shopping Cart
            </Typography>
            <hr />

            <Button
              variant="contained"
              onClick={() => navigate("/cart")}
              sx={{
                gap: "10px",
                border: "1px solid red",
                borderRadius: "100px",
                padding: "5px 20px",
                backgroundColor: "var(--softCrimson)",
              }}
            >
              <ShoppingCartIcon />
              <Typography variant="h6">My Cart</Typography>
            </Button>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ marginTop: "20px", color: "var(--softCrimson)" }}>
              Layout
            </Typography>
            <hr />

            {isListView ? (
              <Button
                variant="contained"
                onClick={handleListAndGridView}
                sx={{
                  gap: "10px",
                  border: "1px solid red",
                  borderRadius: "100px",
                  padding: "5px 30px",
                  backgroundColor: "var(--softCrimson)",
                }}
              >
                <FormatListBulletedIcon />
                <Typography variant="h6">List</Typography>
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleListAndGridView}
                sx={{
                  gap: "10px",
                  border: "1px solid red",
                  borderRadius: "100px",
                  padding: "5px 30px",
                  backgroundColor: "var(--softCrimson)",
                }}
              >
                <GridViewIcon />
                <Typography variant="h6">Grid</Typography>
              </Button>
            )}
          </Box>
        </Box>

        {isListView ? (
          <Box
            sx={{
              width: { xs: "100%", sm: "100%", md: "80%", lg: "80%" },
              border: "1px solid #333333",
              borderRadius: "12px",
            }}
          >
            {/* Loading Data */}
            {loading &&
              filteredData.length === 0 &&
              Array.from({ length: itemsPerPage }).map((_, i) => <RecipeSkeleton key={`init-${i}`} />)}

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
                        <TableCell sx={tabelCell}>Name</TableCell>
                        <TableCell sx={tabelCell} align="right">
                          Amount
                        </TableCell>
                        <TableCell sx={tabelCell} align="right">
                          Meal Type
                        </TableCell>
                        <TableCell sx={tabelCell} align="right">
                          View Details
                        </TableCell>
                        <TableCell sx={tabelCell} align="right">
                          Add To Cart
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredData.map((food) => (
                        <TableRow key={food.id}>
                          <TableCell
                            sx={{
                              padding: "30px 20px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              fontSize: "18px",
                            }}
                          >
                            <Box
                              component="img"
                              sx={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "8px",
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
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
                            <Button
                              component={NavLink}
                              to={`/home/${food.id}`}
                              variant="contained"
                              size="small"
                              sx={{ padding: "5px 10px", backgroundColor: "var(--softCrimson)" }}
                            >
                              View Details
                            </Button>
                          </TableCell>

                          <TableCell align="right">
                            {items.find((item) => item.id === food.id) ? (
                              <Button
                                onClick={() => navigate("/cart")}
                                variant="contained"
                                sx={{ backgroundColor: "var(--softCrimson)" }}
                              >
                                GO TO BAG
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleCart(food)}
                                variant="contained"
                                sx={{ backgroundColor: "var(--softCrimson)" }}
                              >
                                ADD TO CART
                              </Button>
                            )}
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
              gridTemplateColumns: {
                sm: "repeat(2 , 1fr)",
                md: "repeat(auto-fill, 450px)",
                lg: "repeat(auto-fill, 450px)",
              },
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
              marginTop: { xs: "20px", sm: "20px", md: "0px", lg: "0px" },
            }}
          >
            {/* Loading Data */}
            {loading &&
              filteredData.length === 0 &&
              Array.from({ length: itemsPerPage }).map((_, i) => <RecipeSkeleton key={`init-${i}`} />)}

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
                    border: "1px solid var(--jetGray)",
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
                            backgroundColor: "var(--softCrimson)",
                            fontSize: "small",
                          },
                        },
                        arrow: {
                          sx: {
                            color: "var(--softCrimson)",
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
                        <Button
                          onClick={() => navigate(`/home/${food.id}`)}
                          sx={{ padding: "10px 20px", backgroundColor: "var(--softCrimson)" }}
                          variant="contained"
                        >
                          VIEW DETAILS
                        </Button>
                      </Box>

                      <Box>
                        {items.find((item) => item.id === food.id) ? (
                          <Button
                            onClick={() => navigate("/cart")}
                            sx={{ padding: "10px 25px", backgroundColor: "var(--softCrimson)" }}
                            variant="contained"
                          >
                            GO TO BAG
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleCart(food)}
                            sx={{ padding: "10px 20px", backgroundColor: "var(--softCrimson)" }}
                            variant="contained"
                          >
                            ADD TO CART
                          </Button>
                        )}
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

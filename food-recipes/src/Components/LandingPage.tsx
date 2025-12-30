import { Box, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import cart from "../assets/cart.png";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
<<<<<<< HEAD
import Toast from "../assets/Toast.png"
=======
import ChooseLanguage from "./ChooseLanguage";
>>>>>>> 0e418867c99112a1a9ddc720b1c44bd032ecb767
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import rupee from "../assets/rupee.png";
import bowl1 from "../assets/bowl1.png";
import bowl2 from "../assets/bowl2.png";
import bowl3 from "../assets/bowl3.png";
import bowl4 from "../assets/bowl4.png";
import { useAppDispatch, useAppSelector, useAuthSelector } from "./hooks";
import { logout, resetLoginStatus } from "../Redux/AuthSlice";
import { toast } from "react-toastify";
import { AccountCircle, Language, Logout } from "@mui/icons-material";

type slider = {
  title1: string;
  title2: string;
  image: string;
};

const MotionBox = motion(Box);

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuthSelector((state) => state.foodAuth);
  const { items } = useAppSelector((state) => state.foodCart);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [isPopup, setIsPopup] = useState<boolean>(false);

  const sliderData: slider[] = [
    {
      title1: "The essence of India,",
      title2: "plated perfectly.",
      image: image1,
    },
    {
      title1: "Where tradition",
      title2: "meets taste.",
      image: image2,
    },
    {
      title1: "Desserts that steal",
      title2: "the show.",
      image: image3,
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLanguageChange() {
    setIsPopup(true);
    handleClose();
  }

  // LogOut
  function handleLogout() {
    dispatch(logout());
    toast.success("Logout Successful");
    dispatch(resetLoginStatus());
    handleClose();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderData.length]);

  const currentSlider = sliderData[currentIndex];

  return (
    <Box sx={{ padding: { xs: "16px", sm: "32px", md: "40px", lg: "48px" } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          gap: { xs: "16px", sm: "16px" },
          justifyContent: { lg: "space-around", md: "space-around", sm: "center", xs: "center" },
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4">
            For
            <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>
              My
            </Box>
            Foodies
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: { xs: "24px", sm: "48px", md: "32px", lg: "48px" } }}>
          <Button component={NavLink} to="/home" variant="text" sx={{ color: "#333333" }}>
            Home
          </Button>
          <Button component={NavLink} to="/menu" variant="text" sx={{ color: "#333333" }}>
            Menu
          </Button>
          <Button component={NavLink} to="/about" variant="text" sx={{ color: "#333333" }}>
            About Us
          </Button>
          <Button component={NavLink} to="/contact" variant="text" sx={{ color: "#333333" }}>
            Contact
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "32px", sm: "64px", md: "16px", lg: "20px" } }}>
          <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box
              component="img"
              src={cart}
              alt="cart"
              onClick={() => navigate("/cart")}
              sx={{ width: "25px", height: "25px", cursor: "pointer" }}
            ></Box>
            <Typography
              variant="body1"
              sx={{
                color: "white",
                fontSize: "10px",
                backgroundColor: items.length !== 0 ? "#EF4444" : "transparent",
                padding: "3px 6px",
                borderRadius: "100px",
                position: "absolute",
                right: "-30%",
                top: "-40%",
              }}
            >
              {items.length > 0 ? items.reduce((sum, acc) => sum + acc.quantity, 0) : ""}
            </Typography>
          </Box>

          {!isAuthenticated && (
            <Button variant="contained" onClick={() => navigate("/login")} sx={{ padding: "8px 24px" }}>
              Log In
            </Button>
          )}

          {isAuthenticated && (
            <Box>
              <IconButton onClick={handleClick}>
                <AccountCircle fontSize="large" />
              </IconButton>

              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleLanguageChange}>
                  <ListItemIcon>
                    <Language fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">Language</Typography>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Box>

      {isPopup && <ChooseLanguage setPopup={setIsPopup} />}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "64px",
          gap: { xs: "16px", sm: "48px", md: "80px", lg: "112px" },
        }}
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h3" sx={{ fontSize: { xs: "24px", sm: "32px", md: "32px", lg: "48px" } }}>
                {currentSlider.title1}
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: "24px", sm: "32px", md: "32px", lg: "48px" } }}>
                {currentSlider.title2}
              </Typography>

              <Box sx={{ textAlign: "left" }}>
                <Button
                  variant="contained"
                  sx={{ marginTop: "3rem", padding: { sm: "8px 32pxrem", md: "8px 80px", lg: "8px 112px" } }}
                  onClick={() => navigate("/menu")}
                >
                  View Menu
                </Button>
              </Box>
            </Box>
          </MotionBox>
        </AnimatePresence>

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            width: { xs: "30%", sm: "32%", md: "35%", lg: "35%" },
            height: { xs: "180px", sm: "250px", md: "300px", lg: "400px" },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={currentSlider.image}
              alt="image"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </AnimatePresence>
        </Box>
      </Box>


<Box sx={{ marginTop: { xs: "140px", sm: "160px", md: "180px", lg: "208px" }, display: "flex",  gap: "40px",  justifyContent: "space-evenly" }}>
        <Box
          sx={{
            position: "relative",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            border: "1px solid gray",
            width: { xs: "20%", sm: "19%", md: "18%", lg: "17%" },
            height: "350px",
            padding: "32px",
            borderRadius: "50px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "300px" }}>
            <Box sx={{ marginTop: "80px" }}>
              <Typography variant="h5" sx={{ fontSize: { xs: "20px", sm: "25px", md: "30px", lg: "35px" } }}>
                Cocoa Fusion
              </Typography>
              <Typography sx={{ marginTop: "8px", fontSize: { xs: "12px", sm: "13px", md: "14px", lg: "16px" } }}>
                with Natural Ingredients
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontSize: { xs: "15px" } }}>
                <Box component="img" src={rupee} width="15px" height="10x"></Box>749
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              left: { xs: "18%", sm: "12%", md: "5%", lg: "3%" },
              top: { xs: "-20%", sm: "-30%", md: "-40%", lg: "-50%" },
              zIndex: 1,
            }}
          >
            <Box
              component="img"
              src={bowl4}
              alt="bowl4"
              width={{ xs: "80%", sm: "90%", md: "95%", lg: "100%" }}
              height={{ xs: "180px", sm: "220px", md: "240px", lg: "280px" }}
            ></Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            border: "1px solid gray",
            width: { xs: "20%", sm: "19%", md: "18%", lg: "17%" },
            height: "350px",
            padding: "32px",
            borderRadius: "50px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "300px" }}>
            <Box sx={{ marginTop: "80px" }}>
              <Typography variant="h5" sx={{ fontSize: { xs: "20px", sm: "25px", md: "30px", lg: "35px" } }}>
                Veggie Medley
              </Typography>
              <Typography sx={{ marginTop: "8px", fontSize: { xs: "12px", sm: "13px", md: "14px", lg: "16px" } }}>with Fresh Veggies</Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontSize: { xs: "15px" } }}>
                <Box component="img" src={rupee} width="15px" height="10x"></Box>449
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              left: { xs: "18%", sm: "12%", md: "5%", lg: "3%" },
              top: { xs: "-20%", sm: "-30%", md: "-40%", lg: "-50%" },
              zIndex: 1,
            }}
          >
            <Box
              component="img"
              src={bowl2}
              alt="bowl1"
              width={{ xs: "80%", sm: "90%", md: "95%", lg: "100%" }}
              height={{ xs: "180px", sm: "220px", md: "240px", lg: "280px" }}
            ></Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            border: "1px solid gray",
            width: { xs: "20%", sm: "19%", md: "18%", lg: "17%" },
            height: "350px",
            padding: "32px",
            borderRadius: "50px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "300px" }}>
            <Box sx={{ marginTop: "80px" }}>
              <Typography variant="h5" sx={{ fontSize: { xs: "20px", sm: "25px", md: "30px", lg: "35px" } }}>
                Saalmon Bowl
              </Typography>
              <Typography sx={{ marginTop: "8px", fontSize: { xs: "12px", sm: "13px", md: "14px", lg: "16px" } }}>with Fresh Salmon</Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontSize: { xs: "15px" } }}>
                <Box component="img" src={rupee} width="15px" height="10x"></Box>349
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              left: { xs: "18%", sm: "12%", md: "5%", lg: "3%" },
              top: { xs: "-20%", sm: "-30%", md: "-40%", lg: "-50%" },
              zIndex: 1,
            }}
          >
            <Box
              component="img"
              src={bowl3}
              alt="bowl1"
              width={{ xs: "80%", sm: "90%", md: "95%", lg: "100%" }}
              height={{ xs: "180px", sm: "220px", md: "240px", lg: "280px" }}
            ></Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            border: "1px solid gray",
            width: { xs: "20%", sm: "19%", md: "18%", lg: "17%" },
            height: "350px",
            padding: "32px",
            borderRadius: "50px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "300px" }}>
            <Box sx={{ marginTop: "80px" }}>
              <Typography variant="h5" sx={{ fontSize: { xs: "20px", sm: "25px", md: "30px", lg: "35px" } }}>
                Tokyo Teriyaki
              </Typography>
              <Typography sx={{ marginTop: "8px", fontSize: { xs: "12px", sm: "13px", md: "14px", lg: "16px" } }}>with Glazed Chicken</Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontSize: { xs: "15px" } }}>
                <Box component="img" src={rupee} width="15px" height="10x"></Box>949
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              left: { xs: "18%", sm: "12%", md: "5%", lg: "3%" },
              top: { xs: "-20%", sm: "-30%", md: "-40%", lg: "-50%" },
              zIndex: 1,
            }}
          >
            <Box
              component="img"
              src={bowl1}
              alt="bowl1"
              width={{ xs: "80%", sm: "90%", md: "95%", lg: "100%" }}
              height={{ xs: "180px", sm: "220px", md: "240px", lg: "280px" }}
            ></Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ marginTop: "80px", padding: "10px 112px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              Crave-Worthy Dishes
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              You'll Love
            </Typography>
          </Box>

          <Box>
            <Typography variant="body1">Discover crave-worthy dishes you'll love--easy to make,</Typography>
            <Typography variant="body1">full of flavor , and always satisfying </Typography>
          </Box>
        </Box>

        <Box sx={{marginTop:"32px"}}>
            <Box sx={{border:"1px solid red" , borderRadius:"20px" , width:"30%" , height:"350px" , position:"relative"}}>
              <Box sx={{ backgroundImage:`url(${Toast})` , backgroundSize:"cover", backgroundRepeat:"no-repeat" , width:"100%" , height:"100%"}}></Box>
              <Button sx={{position:"absolute" , top:"82.7%" , width:"100%" , height:"60px" , borderRadius:"12px" , backdropFilter:"blur(100px)"}}>French Toast</Button>
            </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;

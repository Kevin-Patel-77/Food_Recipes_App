import { Box, Button, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import cart from "../assets/cart.png";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import rupee from "../assets/rupee.png";
import bowl1 from "../assets/bowl1.png";
import bowl2 from "../assets/bowl2.png";
import bowl3 from "../assets/bowl3.png";
import bowl4 from "../assets/bowl4.png";
import { useAppDispatch, useAppSelector, useAuthSelector } from "./hooks";
import { logout } from "./Redux/AuthReducer";
import { toast } from "react-toastify";

type slider = {
  title1: string;
  title2: string;
  image: string;
};

let MotionBox = motion(Box);

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const navigate = useNavigate();
  const {recipes , loading , error} = useAppSelector((state)=> state.foodrecipes)
  const { isLogin } = useAuthSelector((state) => state.foodAuth);
  const dispatch = useAppDispatch();

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
  
  // LogOut
  function handleLogout() {
    dispatch(logout());
    toast.success("Logout Successful");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentSlider = sliderData[currentIndex];

  return (
    <Box sx={{ padding: { xs: "1rem", sm: "1.5rem", md: "2.5rem", lg: "3rem" } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          gap: { xs: "1rem", sm: "1rem" },
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4">
            For
            <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>
              My
            </Box>
            Foddies
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: { xs: "3rem", sm: "5rem", md: "1.5rem", lg: "5rem" } }}>
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

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "2rem", sm: "4rem", md: "1rem", lg: "2rem" } }}>
          <Box component="img" src={cart} alt="cart" sx={{ width: "25px", height: "3vh" }}></Box>

          {!isLogin && (
            <Button variant="contained" onClick={() => navigate("/signup")} sx={{ padding: "0.4rem 1.5rem" }}>
              Sign Up
            </Button>
          )}

          {!isLogin && (
            <Button variant="contained" onClick={() => navigate("/login")} sx={{ padding: "0.4rem 1.5rem" }}>
              Log In
            </Button>
          )}

          {isLogin && (
            <Button variant="contained" onClick={handleLogout} sx={{ padding: "0.4rem 1.5rem" }}>
              Log out
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4rem",
          gap: { xs: "1rem", sm: "3rem", md: "5rem", lg: "7rem" },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
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
              <Typography variant="h3" sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2rem", lg: "3rem" } }}>
                {currentSlider.title1}
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2rem", lg: "3rem" } }}>
                {currentSlider.title2}
              </Typography>

              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  sx={{ marginTop: "3rem", padding: { sm: "0.5rem 2rem", md: "0.5rem 5rem", lg: "0.5rem 7rem" } }}
                >
                  View Menu
                </Button>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            width: { xs: "23%", sm: "25%", md: "28%", lg: "30%" },
            height: { xs: "20vh", sm: "25vh", md: "35vh", lg: "40vh" },
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

          <AnimatePresence mode="wait">
            <MotionBox
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              sx={{
                position: "absolute",
                top: "1%",
                left: "1%",
                border: "1px solid rgba(255,255,255,0.4)",
                width: { xs: "100%", sm: "75%", md: "60%", lg: "35%" },
                backgroundColor: "rgba(255,255,255,0.35)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                padding: "0.5rem",
                zIndex: "2",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: { xs: "0.4", sm: "0.5rem", md: "0.8rem", lg: "0.8rem" } }}>
                5%
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: { xs: "0.4", sm: "0.5rem", md: "0.8rem", lg: "0.8rem" } }}>
                <Box
                  component="span"
                  sx={{ color: "#E53935", fontWeight: "bold", fontSize: { xs: "0.4", sm: "0.5rem", md: "0.8rem", lg: "0.8rem" } }}
                >
                  Discount
                </Box>{" "}
                on 2 Orders
              </Typography>
            </MotionBox>
          </AnimatePresence>
        </Box>
      </Box>

      <Box sx={{ marginTop: "13rem", display: "flex", justifyContent: "space-evenly" }}>
        <Box
          sx={{
            position: "relative",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            border: "1px solid gray",
            width: "17%",
            height: "35vh",
            padding: "3rem",
            borderRadius: "50px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "27vh" }}>
            <Box sx={{ marginTop: { xs: "8rem", sm: "7rem", md: "6rem", lg: "5rem" } }}>
              <Typography variant="h5">Cocoa Fusion</Typography>
              <Typography sx={{ marginTop: "0.5rem" }}>with Natural Ingredients </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Box component="img" src={rupee} width="0.9rem" height="1.4vh"></Box>749
              </Typography>
            </Box>
          </Box>

          <Box sx={{ position: "absolute", left: "4%", top: "-50%", zIndex: 1 }}>
            <Box component="img" src={bowl4} alt="bowl4" width="99%" height="28vh"></Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            border: "1px solid gray",
            width: "17%",
            height: "35vh",
            padding: "3rem",
            borderRadius: "50px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "27vh" }}>
            <Box sx={{ marginTop: { xs: "8rem", sm: "7rem", md: "6rem", lg: "5rem" } }}>
              <Typography variant="h5">Veggie Medley</Typography>
              <Typography sx={{ marginTop: "0.5rem" }}>with Fresh Veggies</Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Box component="img" src={rupee} width="0.9rem" height="1.4vh"></Box>449
              </Typography>
            </Box>
          </Box>

          <Box sx={{ position: "absolute", left: "1.5%", top: "-50%", zIndex: 1 }}>
            <Box component="img" src={bowl2} alt="bowl1" width="100%" height="30vh"></Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            border: "1px solid gray",
            width: "17%",
            height: "35vh",
            padding: "3rem",
            borderRadius: "50px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "27vh" }}>
            <Box sx={{ marginTop: { xs: "8rem", sm: "7rem", md: "6rem", lg: "5rem" } }}>
              <Typography variant="h5">Salmon Bowl</Typography>
              <Typography sx={{ marginTop: "0.5rem" }}>with Fresh Salmon</Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Box component="img" src={rupee} width="0.9rem" height="1.4vh"></Box>349
              </Typography>
            </Box>
          </Box>

          <Box sx={{ position: "absolute", left: "1.5%", top: "-50%", zIndex: 1 }}>
            <Box component="img" src={bowl3} alt="bowl1" width="100%" height="30vh"></Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            border: "1px solid gray",
            width: "17%",
            height: "35vh",
            padding: "3rem",
            borderRadius: "50px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "27vh" }}>
            <Box sx={{ marginTop: { xs: "8rem", sm: "7rem", md: "6rem", lg: "5rem" } }}>
              <Typography variant="h5">Tokyo Teriyaki</Typography>
              <Typography sx={{ marginTop: "0.5rem" }}>with Glazed Chicken</Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Box component="img" src={rupee} width="0.9rem" height="1.4vh"></Box>949
              </Typography>
            </Box>
          </Box>

          <Box sx={{ position: "absolute", left: "1.5%", top: "-50%", zIndex: 1 }}>
            <Box component="img" src={bowl1} alt="bowl1" width="100%" height="30vh"></Box>
          </Box>
        </Box>
      </Box>


      <Box>

        <Box>
          
        </Box>

      </Box>

    </Box>
  );
};

export default LandingPage;

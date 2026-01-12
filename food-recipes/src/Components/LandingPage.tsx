import { Box, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import cart from "../assets/cart.png";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import rupee from "../assets/rupee.png";
import cheese from "../assets/Cheese.jpg";
import { useAppDispatch, useAppSelector, useAuthSelector } from "./hooks";
import { logout } from "../Redux/Auth/AuthSlice";
import { toast } from "react-toastify";
import { AccountCircle, CheckBox, Language, Logout } from "@mui/icons-material";
import ChooseLanguage from "./ChooseLanguage";
import EastIcon from "@mui/icons-material/East";
import { BowlItems, headerItem, socialMedias } from "../data/staticData";
import { sliderData } from "../data/staticData";

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
    handleClose();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentSlider = sliderData[currentIndex];

  return (
    <Box>
      <Box sx={{ margin: { sm: "24px 48px", md: "32px 112px", lg: "32px 112px" } }}>
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
              <Box component="span" sx={{ color: "var(--softCrimson)" }}>
                My
              </Box>
              Foodies
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: { sm: "48px", md: "32px", lg: "48px", alignItems: "center" } }}>
            {headerItem.map((item) => (
              <Button component={NavLink} to={item.to} variant="text" sx={{ color: "var(--jetGray)" }}>
                {item.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "32px", sm: "64px", md: "16px", lg: "20px" } }}>
            <Box sx={{ position: "relative", display: "flex" }}>
              <Box
                component="img"
                src={cart}
                alt="cart"
                onClick={() => navigate("/cart")}
                sx={{ width: "25px", height: "auto", cursor: "pointer" }}
              ></Box>
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  fontSize: "10px",
                  backgroundColor: items.length !== 0 ? "var(--softCrimson)" : "transparent",
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
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{ padding: "8px 24px", backgroundColor: "var(--softCrimson)" }}
              >
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
            // flexDirection:{xs:"column"},
            justifyContent: "center",
            alignItems: "center",
            marginTop: "64px",
            gap: { sm: "48px", md: "80px", lg: "112px" },
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
                <Typography sx={{ fontSize: { xs: "20px", sm: "32px", md: "32px", lg: "48px" } }}>
                  {currentSlider.title1}
                </Typography>
                <Typography sx={{ fontSize: { xs: "20px", sm: "32px", md: "32px", lg: "48px" } }}>
                  {currentSlider.title2}                           
                </Typography>                                             
                                                       
                <Box sx={{ textAlign: "left" }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "var(--softCrimson)",
                      marginTop: "48px",
                      padding: { sm: "8px 32px", md: "8px 80px", lg: "8px 112px" },
                    }}
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
              width: { xs: "45%", sm: "32%", md: "35%", lg: "35%" },
              height: { xs: "250px", sm: "250px", md: "300px", lg: "400px" },
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

        <Box
          sx={{
            marginTop: "100px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit , minmax(300px ,1fr))",
            gap: "24px",
          }}
        >
          {BowlItems.map((item) => (
            <Box sx={{ position: "relative", marginTop: "120px" }}>
              <Box sx={{ position: "absolute", top: "0", left: "50%", transform: "translate(-50%, -50%)" }}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{ width: { xs: "220px", sm: "230px", md: "240px", lg: "250px" } }}
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  justifyItems: "center",
                  alignItems: "end",
                  height: "350px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                  border: "1px solid gray",
                  padding: "32px",
                  borderRadius: "50px",
                }}
              >
                <Box>
                  <Typography variant="h4">{item.title}</Typography>
                  <Typography>{item.subTitle}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img src={rupee} alt="rupee" style={{ width: "15px", height: "15px" }} />
                  <Typography>{item.price}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ marginTop: "112px" }}>
          <Box
            sx={{
              display: { xs: "grid", sm: "grid", md: "grid", lg: "flex", xl: "flex" },
              justifyContent: "center",
              alignItems: "center",
              gap: { xs: "40px", sm: "50px", md: "60px", lg: "70px", xl: "80px" },
            }}
          >
            <Box sx={{ textAlign: { xs: "center", sm: "center", md: "center", lg: "left" } }}>
              <Box>
                <Typography variant="h3">Ultimate Creamy Mac</Typography>
                <Typography variant="h3">and Cheese</Typography>
              </Box>

              <Box sx={{ marginTop: "32px", textAlign: "center" }}>
                <Typography>Cheesy, comforting and satisfying--these mac and cheese</Typography>
                <Typography>recipes bring nostalgic flavor with every bite.</Typography>
              </Box>

              <Box
                sx={{
                  marginTop: "24px",
                  display: "flex",
                  gap: "20px",
                  justifyContent: { xs: "center", sm: "center", md: "center", lg: "left", xl: "left" },
                }}
              >
                <Box sx={{ display: "grid", gap: "16px" }}>
                  <CheckBox />
                  <CheckBox />
                  <CheckBox />
                </Box>

                <Box sx={{ display: "grid", gap: "16px" }}>
                  <Typography>Rich , gooey cheese in every bite</Typography>
                  <Typography>Perfect for family or solo cravings</Typography>
                  <Typography>Comfort food made efforlessly delicious</Typography>
                </Box>
              </Box>

              <Box sx={{ marginTop: "48px" }}>
                <Button
                  variant="contained"
                  onClick={()=> navigate("/menu")}
                  sx={{
                    padding: { xs: "8px 40px", sm: "8px 60px", md: "8px 80px", lg: "8px 80px" },
                    fontWeight: "bold",
                    gap: "16px",
                    borderRadius: "100px",
                    backgroundColor: "var(--softCrimson)",
                  }}
                >
                  See Recipes <EastIcon />{" "}
                </Button>
              </Box>
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "100%", md: "100%", lg: "50%", xl: "45%" }, height: "auto" }}>
              <Box
                component="img"
                src={cheese}
                alt="Cheese"
                width="100%"
                height="auto"
                sx={{ borderRadius: "50px" }}
              ></Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ marginTop: "80px", backgroundColor: "#DED2CB" }}>
        <Box
          sx={{
            display: {xs:"grid" , sm:"grid" , md:"flex" ,lg:"flex"} ,
            justifyContent: "space-around",
            padding: { xs:"16px 32px" , sm: "24px 48px", md: "32px 112px", lg: "32px 112px" },
          }}
        >
          <Box sx={{ display: "grid", gap: "20px"}}>
            <Box
              sx={{
                border: "1px solid black",
                width: "180px",
                borderRadius: "100px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">
                For
                <Box component="span" sx={{ color: "var(--softCrimson)" }}>
                  My
                </Box>
                Foodies
              </Typography>
            </Box>

            <Box sx={{ marginTop: "10px" }}>
              <Typography>ForMyFoodies creates simple , flavorful meals for</Typography>
              <Typography>everyday taste and joy.</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: "30px" }}>
              {socialMedias.map((social, index) => {
                const Icons = social.icons;

                return (
                  <Box key={index}>
                    <Icons />
                  </Box>
                );
              })}
            </Box>

            <Box>
              <Typography>&copy; 2026 - All Right Reserved</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between",  marginTop:{xs:"48px" , sm:"48px" , md:"0px"} ,   width:{ xs:"100%" ,sm:"100%" , md:"40%" , lg:"40%"} }}>
            <Box>
              <Typography variant="h6">Quick links</Typography>
              <Box sx={{ display: "grid", gap: "10px", marginTop: "15px"  , cursor:"pointer" }}>
                <Typography variant="body2">All Categories</Typography>
                <Typography variant="body2">Site Map</Typography>
                <Typography variant="body2">About Us</Typography>
                <Typography variant="body2">Help</Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6">Get In Touch</Typography>

              <Box sx={{ display: "grid", gap: "10px", marginTop: "15px" , cursor:"pointer" }}>
                <Typography variant="body2">Privacy Policy</Typography>
                <Typography variant="body2">Terms and Services</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;

{
  /* <Box sx={{ marginTop: "80px", padding: "10px 112px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: "bold" , color:"#333333" }}>
              Crave-Worthy Dishes
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold" , color:"#333333" }}>
              You'll Love
            </Typography>
          </Box>

          <Box>
            <Typography variant="body1">Discover crave-worthy dishes you'll love--easy to make,</Typography>
            <Typography variant="body1">full of flavor , and always satisfying </Typography>
          </Box>
        </Box>
      </Box> */
}

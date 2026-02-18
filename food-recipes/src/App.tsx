import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./Components/theme";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LanguageSync from "./Components/LanguageSync";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import GuestRoutes from "./Components/GuestRoutes";
import { lazy, Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import About from "./Components/About";

const LandingPage = lazy(() => import("./Components/LandingPage"));
const AddToCart = lazy(() => import("./Components/AddToCart"));
const Signup = lazy(() => import("./Components/Signup"));
const RecipesDetails = lazy(() => import("./Components/RecipesDetails"));
const Login = lazy(() => import("./Components/Login"));
const NotFound = lazy(() => import("./Components/NotFound"));
const Menu = lazy(() => import("./Components/Menu"));
const Chats = lazy(() => import("./Components/Chats/Chats"));

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <CircularProgress size="48px" />
            </Box>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />

            <Route
              path="/menu"
              element={
                <ProtectedRoutes>
                  <Menu />
                </ProtectedRoutes>
              }
            />

            <Route path="/home/:id" element={<RecipesDetails />} />
            <Route path="/cart" element={<AddToCart />} />

            <Route
              path="/signup"
              element={
                <GuestRoutes>
                  <Signup />
                </GuestRoutes>
              }
            />

            <Route
              path="/login"
              element={
                <GuestRoutes>
                  <Login />
                </GuestRoutes>
              }
            />

            <Route path="/chats" element={<Chats />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/about" element={<About/>}></Route>
          </Routes>
        </Suspense>
        <LanguageSync />
      </ThemeProvider>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default App;

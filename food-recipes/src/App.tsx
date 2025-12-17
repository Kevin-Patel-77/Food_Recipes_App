import { Route, Routes } from "react-router-dom";
import "./App.css";
// import Dashboard from "./Components/Dashboard";
import AddToCart from "./Components/AddToCart";
import Signup from "./Components/Signup";
import RecipesDetails from "./Components/RecipesDetails";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import Login from "./Components/Login";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./Components/theme";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NotFound from "./Components/NotFound";
import LandingPage from "./Components/LandingPage";
import GuestRoutes from "./Components/GuestRoutes";

function App() {
  console.log(localStorage.getItem("users"));

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/home" element={<LandingPage />}></Route>
          <Route
            path="/home/:id"
            element={
              <ProtectedRoutes>
                <RecipesDetails />
              </ProtectedRoutes>
            }
          ></Route>
          <Route path="/cart" element={<AddToCart />}></Route>

          <Route
            path="/signup"
            element={
              <GuestRoutes>
                <Signup />
              </GuestRoutes>
            }
          ></Route>

          <Route
            path="/login"
            element={
              <GuestRoutes>
                <Login />
              </GuestRoutes>
            }
          ></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
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

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import { login, resetLoginStatus } from "../Redux/AuthSlice";
import { Box, Button, IconButton, InputAdornment, InputLabel, TextField, Typography } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha }  from 'react-simple-captcha'


type login = {
  email: string;
  password: string;
};
  
const Login = () => {
  const disptach = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<login>();
  const { loginStatus } = useAppSelector((state) => state.foodAuth);

  const [captchaInput, setCaptchaInput] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit: SubmitHandler<login> = (data) => {
    if (!validateCaptcha(captchaInput)) {
      setMessage("Captcha Does not Match");
      loadCaptchaEnginge(6);
      return;
    }

    setMessage("Captcha Matched");
    disptach(login(data));
  };

  useEffect(() => {
    if (loginStatus === "success") {
      toast.success("Login Successful!");
      navigate("/home");
    }

    if (loginStatus === "error") {
      toast.error("Invalid Credentials");
      disptach(resetLoginStatus());
    }
  }, [loginStatus, disptach, navigate]);

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "98%", sm: "80%", md: "70%", lg: "50%" },
          padding: "16px",
          border: "1px solid black",
          borderRadius: "20px",
          textAlign: "center",
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{
              mb: "48px",
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#333333",
            }}
          >
            Log In
          </Typography>
        </Box>

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ width: "50%", margin: "auto" }}>
          <InputLabel htmlFor="email" sx={{ color: "#333333" }}>
            Email
          </InputLabel>
          <TextField
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ marginBottom: "1rem" }}
            fullWidth
          />

          <InputLabel htmlFor="password" sx={{ color: "#333333" }}>
            Password
          </InputLabel>
          <TextField
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            sx={{ marginBottom: "1rem" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <Eye /> : <EyeOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: { xs: "grid", sm: "flex", md: "flex", lg: "flex" }, gap: "32px", alignItems: "center", margin: "32px 0" }}>
            <Box>
              <LoadCanvasTemplate reloadColor="red" />
            </Box>

            <Box>
              <InputLabel sx={{ color: "#333333" }}>Enter Captcha Code</InputLabel>
              <TextField type="text" onChange={(e) => setCaptchaInput(e.target.value)} value={captchaInput}></TextField>
              {message && <Typography sx={{ color: message == "Captcha Matched" ? "green" : "red" }}>{message}</Typography>}
            </Box>
          </Box>

          <Box>
            <Button
              variant="contained"
              type="submit"
              sx={{
                p: "0.5rem 3rem",
                marginTop: "1.5rem",
                marginBottom: "1rem",
                width: "90%",
              }}
            >
              Log In
            </Button>
            <Typography>
              Don't have an account?{" "}
              <Typography sx={{ color: "#E53935" }} component={NavLink} to="/signup">
                Register here
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;

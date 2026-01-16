import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import { Box, Button, IconButton, InputAdornment, InputLabel, TextField, Typography } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { LoginPayload } from "../Redux/Auth/AuthSlice";
import { loginUser } from "../Redux/Auth/AuthThunk";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const Login = () => {
  const disptach = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { user, error } = useAppSelector((state) => state.foodAuth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginPayload> = (data) => {
    if (!captchaToken) {
      toast.error("Please verify captcha");
      return;
    }

    disptach(
      loginUser({
        email: data.email,
        password: data.password,
        hcaptchaToken: captchaToken,
      })
    );
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (user?.success == true) {
      toast.success(user.message);
      navigate("/home");
    }
  }, [user, error, navigate]);

  return (
    <Box
      sx={{
        height: { xs: "100vh", sm: "100vh", md: "90vh", lg: "80vh" },
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
              fontSize: "40px",
              fontWeight: "bold",
              color: "var(--jetGray)",
            }}
          >
            Log In
          </Typography>
        </Box>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: { sm: "80%", md: "70%", lg: "60%" }, margin: "auto" }}
        >
          <InputLabel htmlFor="email" sx={{ color: "var(--jetGray)", marginTop: "16px" }}>
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
            fullWidth
          />

          <InputLabel htmlFor="password" sx={{ color: "#333333", marginTop: "16px" }}>
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

          <Box
            sx={{
              mt: 4,
              mb: 2,
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                transform: {
                  xs: "scale(0.85)",
                  sm: "scale(1)",
                },
                transformOrigin: "center",
              }}
            >
              <HCaptcha
                sitekey="20000000-ffff-ffff-ffff-000000000002"
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
              />
            </Box>
          </Box>

          <Box sx={{ marginTop: "32px", marginBottom: "16px" }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                p: "8px 48px",
                width: "90%",
                backgroundColor: "var(--softCrimson)",
              }}
            >
              Log In
            </Button>
            <Box sx={{mt:1}}>
              <Typography sx={{ fontSize: { xs: "12px", sm: "16px" } }}>
                Don't have an account?{" "}
                <Typography
                  sx={{ color: "var(--darkCrimson)", fontSize: { xs: "12px", sm: "16px" } }}
                  component={NavLink}
                  to="/signup"
                >
                  Register here
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;

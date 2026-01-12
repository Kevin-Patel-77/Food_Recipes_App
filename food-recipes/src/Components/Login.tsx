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

const topBottomMargin = {
  marginTop: "32px",
  marginBottom: "16px",
};

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
        hcaptchaToken:captchaToken
      })
    );
  };

  useEffect(() => {
    if (user?.success == true) {
      toast.success(user.message);
      navigate("/home");
    }

    if (error) {
      toast.error(user?.message);
    }
  }, [user, error, navigate]);

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
              color: "var(--jetGray)",
            }}
          >
            Log In
          </Typography>
        </Box>

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ width: "50%", margin: "auto" }}>
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

          <Box sx={topBottomMargin}>
            <HCaptcha
              sitekey="20000000-ffff-ffff-ffff-000000000002"
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
            />
          </Box>

          <Box sx={topBottomMargin}>
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
            <Typography>
              Don't have an account?{" "}
              <Typography sx={{ color: "var(--darkCrimson)" }} component={NavLink} to="/signup">
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

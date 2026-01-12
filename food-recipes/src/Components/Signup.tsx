import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import { Eye, EyeOff } from "lucide-react";
import { Box, Button, InputLabel, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { signUpUser } from "../Redux/Auth/AuthThunk";
import { SignupPayload } from "../Redux/Auth/AuthSlice";

const Signup = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user , error } = useAppSelector((state) => state.foodAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupPayload>();

  const onSubmit: SubmitHandler<SignupPayload> = (data) => {
    dispatch(signUpUser(data));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    
    if (user?.success) {
      toast.success(user.message);
      navigate("/login");
    }

  }, [user , error , navigate]);

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
          padding: "16px",
          width: { xs: "98%", sm: "80%", md: "70%", lg: "50%" },
          border: "1px solid black",
          borderRadius: "20px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography variant="h4" mb="48px" sx={{ color: "var(--jetGray)" }}>
          Create Account
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ width: "50%", margin: "auto" }}>
          <InputLabel htmlFor="username" sx={{ color: "var(--jetGray)" }}>
            UserName:
          </InputLabel>
          <TextField
            id="username"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />

          <InputLabel htmlFor="email" sx={{ color: "var(--jetGray)", marginTop: "16px" }}>
            Email:
          </InputLabel>
          <TextField
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[a-z0-9]+(\.[a-z0-9]+)*@[a-z0-9]+\.[a-z]{2,}$/i, message: "Invalid email format" },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          <InputLabel htmlFor="password" sx={{ color: "var(--jetGray)", marginTop: "16px" }}>
            Password:
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
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Password must contain uppercase, lowercase, number & special character",
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

          <Button
            variant="contained"
            sx={{ p: "8px 48px", marginTop: "24px", marginBottom: "16px", backgroundColor: "var(--softCrimson)" }}
            type="submit"
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;

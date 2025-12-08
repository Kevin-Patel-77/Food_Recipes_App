import { addUser } from "./Redux/AuthReducer";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./hooks";
import type { Users } from "./Redux/AuthReducer";
import { Eye , EyeOff } from 'lucide-react';
import { Box, Button, InputLabel, TextField, Typography, IconButton,InputAdornment,} from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";


const Signup = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Users>();

  const onSubmit: SubmitHandler<Users> = (data) => {
    dispatch(addUser(data));
    toast.success("SignUp Successful");
    navigate("/food");
  };

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
          padding: "1rem",
          width: { xs: "98%", sm: "80%", md: "70%", lg: "50%" },
          border: "1px solid black",
          borderRadius: "20px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h4"
          mb="3rem"
          fontWeight="bold"
          sx={{ color: "#ff6f00" }}
        >
          Create Account
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "50%", margin: "auto" }}
        >
          <InputLabel htmlFor="username" sx={{ color: "#ff6f00" }}>
            UserName:
          </InputLabel>
          <TextField
            id="username"
            {...register("userName", { required: "Name is required" })}
            error={!!errors.userName}
            helperText={errors.userName?.message}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />

          <InputLabel htmlFor="email" sx={{ color: "#ff6f00" }}>
            Email:
          </InputLabel>
          <TextField
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />

          <InputLabel htmlFor="password" sx={{ color: "#ff6f00" }}>
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
                value:
                  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain uppercase, lowercase, number & special character",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            sx={{ marginBottom: "1rem" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            sx={{ p: "0.5rem 3rem", marginTop: "1.5rem", marginBottom: "1rem" }}
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

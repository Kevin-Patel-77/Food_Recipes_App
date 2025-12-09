import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import { login } from "./Redux/AuthReducer";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

type login = {
  email: string;
  password: string;
};

const Login = () => {
  const disptach = useAppDispatch();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<login>();
  const { isLogin } = useAppSelector((state) => state.foodAuth);

  const onSubmit: SubmitHandler<login> = (data) => {
    setSubmitted(true);
    disptach(login(data));
  };

  useEffect(() => {
    if (!submitted) return;

    if (isLogin) {
      toast.success("Login Successful");
      navigate("/food");
    } else {
      toast.error("Invalid Credentials");
    }

    setSubmitted(false)
  }, [isLogin, submitted]);

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
          padding: "1rem",
          border: "1px solid black",
          borderRadius: "20px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            mb: "3rem",
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#ff6f00",
          }}
        >
          Log In
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "50%", margin: "auto" }}
        >
          <InputLabel htmlFor="email" sx={{ color: "#ff6f00" }}>
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

          <InputLabel htmlFor="password" sx={{ color: "#ff6f00" }}>
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
            type="submit"
            sx={{ p: "0.5rem 3rem", marginTop: "1.5rem", marginBottom: "1rem" }}
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks'
import { login } from './Redux/AuthReducer'
import { Box, Button, InputLabel, TextField, Typography } from '@mui/material'

type login = {
  email: string,
  password: string
}

const Login = () => {
  const disptach = useAppDispatch()
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState<login>({ email: "", password: "" })
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { isLogin } = useAppSelector((state) => state.foodAuth)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLoginData({ ...loginData, [event.target.name]: event.target.value })
  }

  function handleClick() {
    if (loginData.email === "" && loginData.password === "") {
      alert("Fill the details")
      return
    }
    setSubmitted(true)
    disptach(login(loginData))
  }

  useEffect(() => {

    if (!submitted) return;

    if (isLogin) {
      alert("Login Successful");
      navigate("/food")
    } else {
      alert("Invalid Credentials");
    }
  }, [isLogin, submitted]);

  return (
    <Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ width: { xs: "98%", sm: "80%", md: "70%", lg: "50%" }, padding: "1rem", border: "1px solid black", borderRadius: "20px", textAlign: "center", backdropFilter: "blur(10px)" }}>
        <Typography variant='body1' sx={{ mb: "3rem", fontSize: "2.5rem", fontWeight: "bold" , color:"#ff6f00" }}>Log In</Typography>

        <Box sx={{ width: "50%", margin: "auto" }}>

          <InputLabel htmlFor="email" sx={{color:"#ff6f00" }}>Email</InputLabel>
          <TextField type='email' id='email' name="email" onChange={handleChange} value={loginData.email} sx={{ marginBottom: "1rem" }} fullWidth />

          <InputLabel htmlFor="password" sx={{color:"#ff6f00" }}>Password</InputLabel>
          <TextField id='password' value={loginData.password} name='password' fullWidth onChange={handleChange} type='password' sx={{ marginBottom: "1rem" }} />


          <Button variant="contained" onClick={handleClick} sx={{ p: "0.5rem 3rem", marginTop: "1.5rem", marginBottom: "1rem" }}>Log In</Button>

        </Box>
      </Box>
    </Box>
  )
}

export default Login

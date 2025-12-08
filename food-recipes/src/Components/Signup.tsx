import { useState } from 'react'
import { addUser } from './Redux/AuthReducer'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from './hooks'
import type { Users } from './Redux/AuthReducer'
import { Box, Button, InputLabel, TextField, Typography } from '@mui/material'


const Signup = () => {
  const navigate = useNavigate()
  const disptach = useAppDispatch()
  const [userData, setUserData] = useState<Users>({ userName: "", email: "", password: "" })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserData({ ...userData, [event.target.name]: event.target.value })
  }

  function handleClick() {
    if (userData.userName == "" || userData.userName == "" || userData.password == "") {
      alert("Fill All the Details")
      return
    }

    disptach(addUser(userData))
    alert("SignUp Successful")
    navigate('/food')
  }

  return (
    <Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box sx={{ padding: "1rem", width: { xs: "98%", sm: "80%", md: "70%", lg: "50%" }, border: "1px solid black", borderRadius: "20px", textAlign: "center", backdropFilter: "blur(10px)" }}>
        <Typography variant='h4' mb="3rem" fontWeight="bold" sx={{color:"#ff6f00"}}>Create Account</Typography>

        <Box sx={{ width: "50%", margin: "auto" }}>
          <InputLabel htmlFor='username' sx={{color:"#ff6f00"}}>UserName:</InputLabel>
          <TextField
            id='username'
            name="userName"
            value={userData.userName}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />


          <InputLabel htmlFor='email' sx={{color:"#ff6f00"}}>Email:</InputLabel>
          <TextField
            id='email'
            name="email"
            value={userData.email}
            type='email'
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />

          <InputLabel htmlFor='password' sx={{color:"#ff6f00"}}>Password:</InputLabel>
          <TextField
            id='password'
            name="password"
            value={userData.password}
            type='password'
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />
        </Box>

        <Box>
          <Button variant='contained' sx={{ p: "0.5rem 3rem", marginTop: "1.5rem", marginBottom: "1rem"}} onClick={handleClick}>Sign Up</Button>
        </Box>

      </Box>
    </Box>
  )
}

export default Signup

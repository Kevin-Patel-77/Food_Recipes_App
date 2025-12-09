import { Box, Button, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const navigate = useNavigate()
  return (
    <Box sx={{height:"100vh" , display:"flex" ,  flexDirection:"column" ,  alignItems:"center" , justifyContent:"center"}}>
        <Box sx={{display:"flex", alignItems:"center"}}>
        <Typography variant="h1" sx={{fontSize:"15rem" , color:"#ff6f00"}}>4</Typography>
        <Box component="img" src="../../public/plate.png" alt="food"></Box>
        <Typography variant="h1"  sx={{fontSize:"15rem" , color:"#ff6f00"}}>4</Typography>
        </Box>

        <Box>
            <Typography variant="h4">Whoops , nothing delicious to find here.</Typography>
        </Box>

        <Box sx={{marginTop:"5rem"}}>
            <Button onClick={() => navigate("/food")} sx={{padding:"0.5rem 3rem" , fontWeight:"bold"}}>
                Go Home
            </Button>
        </Box>
    </Box>
  )
}

export default NotFound


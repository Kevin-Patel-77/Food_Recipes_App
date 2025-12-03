import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './Components/Dashboard'
import AddToCart from './Components/AddToCart'
import Signup from './Components/Signup'
import RecipesDetails from './Components/RecipesDetails'
import ProtectedRoutes from './Components/ProtectedRoutes'
import Login from './Components/Login'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './Components/theme'

function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Routes>
        <Route path='/' element={<Dashboard />}></Route>
        <Route path='/food' element={<Dashboard />}></Route>
        <Route path='/food/:id' element={<ProtectedRoutes> <RecipesDetails/> </ProtectedRoutes>}></Route>
        <Route path='/cart' element={<AddToCart/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>} ></Route>
    </Routes>
    </ThemeProvider>
    </>
  )
}

export default App

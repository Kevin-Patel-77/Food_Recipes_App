import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks'
import { login } from './Redux/AuthReducer'

 type login = {
    email:string , 
    password:string
 } 

const Login = () => {
  const disptach = useAppDispatch()
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState<login>({ email: "", password: "" })
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { isLogin } = useAppSelector((state) => state.foodAuth)

  function handleChange(event:React.ChangeEvent<HTMLInputElement>) {
    setLoginData({ ...loginData, [event.target.name]: event.target.value })
  }

  function handleClick() {
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
  }, [isLogin , submitted]);

  return (
    <div className='Auth'>
      <div className='Auth-box'>
        <p>Log In</p>

        <div className='Auth-data'>

          <div className='Auth-inputs'>
            <label htmlFor="email">Email:</label>
            <input type="email" onChange={handleChange} name='email' value={loginData.email} id="email" />
          </div>

          <div className='Auth-inputs'>
            <label htmlFor="password">Password:</label>
            <input type="password" onChange={handleChange} name='password' value={loginData.password} id="password" />
          </div>

          <div className='Auth-button'>
            <button onClick={handleClick}>Log In</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

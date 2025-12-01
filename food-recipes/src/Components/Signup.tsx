import {useState } from 'react'
import { addUser } from './Redux/AuthReducer'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from './hooks'
import type { Users } from './Redux/AuthReducer'


const Signup = () => {
  const navigate = useNavigate()
  const disptach = useAppDispatch()
  const [userData , setUserData] = useState<Users>({userName:"" , email:"" , password:""})

  function handleChange(event : React.ChangeEvent<HTMLInputElement>){ 
    setUserData({ ...userData , [event.target.name] : event.target.value})      
  }

  function handleClick(){
    if(userData.userName == "" || userData.userName == "" || userData.password==""){
      alert("Fill All the Details")
    }

    disptach(addUser(userData))
    alert("SignUp Successful")
    navigate('/food')
  }

  return (  
    <div className='Auth'>
      <div className='Auth-box'>
        <p>Create Account</p>

        <div className='Auth-data'> 
          <div className='Auth-inputs'>
            <label htmlFor="username">Username:</label>
            <input onChange={handleChange} name='userName' value={userData.userName} type="text" id="username" />
          </div>

           <div className='Auth-inputs'>
            <label htmlFor="email">Email:</label>
            <input onChange={handleChange} name='email' value={userData.email} type="email" id="email" />
          </div>

           <div className='Auth-inputs'> 
            <label htmlFor="password">Password:</label>
            <input onChange={handleChange} name='password' value={userData.password} type="password" id="password" />
          </div>

          <div className='Auth-button'>
            <button onClick={handleClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup

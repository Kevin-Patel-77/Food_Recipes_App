import { Navigate, useLocation } from 'react-router-dom'

type ProtectedProps = {
    children: React.ReactNode;
};

const ProtectedRoutes: React.FC<ProtectedProps> = ({ children }) => {
    const location = useLocation()
    const storedValue = localStorage.getItem("isLogin");
    const isLogin: boolean = storedValue ? JSON.parse(storedValue) : false;
    return isLogin ? children : <Navigate to='/login' state={{from:location}} replace={false}/>
}

export default ProtectedRoutes

import { Navigate} from 'react-router-dom'

type ProtectedProps = {
    children: React.ReactNode;
};

const ProtectedRoutes: React.FC<ProtectedProps> = ({ children }) => {
    const storedValue = localStorage.getItem("isLogin");
    const isLogin: boolean = storedValue ? JSON.parse(storedValue) : false;
    return isLogin ? children : <Navigate to='/login' replace={true}/>
}

export default ProtectedRoutes

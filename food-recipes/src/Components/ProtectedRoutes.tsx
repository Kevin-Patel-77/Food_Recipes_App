import { Navigate} from 'react-router-dom'
import { useAppSelector } from './hooks';

type ProtectedProps = {
    children: React.ReactNode;
};

const ProtectedRoutes: React.FC<ProtectedProps> = ({ children }) => {
    
    const {isAuthenticated} = useAppSelector((state)=> state.foodAuth)
    
    return isAuthenticated ? children : <Navigate to='/login' replace={true}/>
}

export default ProtectedRoutes

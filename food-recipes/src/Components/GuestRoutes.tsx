import { Navigate } from "react-router-dom";


type GuestProps = {
  children: React.ReactNode;
};


const GuestRoutes: React.FC<GuestProps> = ({children}) => {
    const storedValues = localStorage.getItem("isLogin");
    const isLogin:boolean = storedValues ? JSON.parse(storedValues) : false;

    return isLogin ? <Navigate to="/food" /> : children
}

export default GuestRoutes
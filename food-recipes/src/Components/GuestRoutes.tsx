import { Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks";

type GuestProps = {
  children: React.ReactNode;
};

const GuestRoutes: React.FC<GuestProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.foodAuth);

  return isAuthenticated ? <Navigate to="/home" /> : children;
};

export default GuestRoutes;

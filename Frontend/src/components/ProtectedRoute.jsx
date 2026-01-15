import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../contexts/userContext";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useContext(UserContext);
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;

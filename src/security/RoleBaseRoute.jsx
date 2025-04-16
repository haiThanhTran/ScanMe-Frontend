import { Navigate } from "react-router-dom";

const RoleBaseRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem("role");
    console.log(localStorage)

    if (!role) {
        return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/403" />;
    }

    return children;
};

export default RoleBaseRoute;

import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import authService from '../services/AuthService.jsx';

const PrivateRoute = () => {
    const isAuthenticated = authService.isAuthenticated();

    const pathName = window.location.pathname === "/checkout";

    localStorage.setItem("redirectUrl", window.location.pathname);

    return isAuthenticated ?
        <Outlet/>
        : pathName ? <Navigate to="/login"/> : <Navigate to="/"/>;
};

export default PrivateRoute;

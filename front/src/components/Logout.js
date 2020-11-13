import React from 'react';
import { useDispatch} from "react-redux";

import {logoutRequest} from "../modules/auth";

const Logout = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutRequest());
        
    }


    return (
        <a style={{ textDecoration: "none" }} onClick={handleLogout}>로그아웃</a>
    );
};

export default Logout;
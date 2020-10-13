import React from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch} from "react-redux";

import logoutRequest from "../modules/auth";

const Logout = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutRequest());
        
    }


    return (
        <a style={{ textDecoration: "none" }} onClick={handleLogout}>로그아웃</a>
    );
};

export default Logout;
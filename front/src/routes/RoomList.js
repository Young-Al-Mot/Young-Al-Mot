import React from 'react';
import Headers from "../components/Header";
import { Link } from "react-router-dom";

import RoomListContainer from "../containers/RoomListContainer"


const RoomList = () => {
    return (
        <div>
            <Headers/>
            <RoomListContainer/>
            <Link style={{ textDecoration: "none" }} to='/room' >테스트 방</Link>
        </div>
    );
};

export default RoomList;
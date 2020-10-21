import React from 'react';
import Headers from "../components/Header";
import { Link } from "react-router-dom";

const RoomList = () => {
    return (
        <div>
            <Headers/>
            방목록 화면<br/>
            <Link style={{ textDecoration: "none" }} to='/room' >테스트 방</Link>
        </div>
    );
};

export default RoomList;
import React from 'react';
import {Link} from 'react-router-dom';

const Header = () => {
    return (
        <div>
            <Link to="/login">login</Link>
            위쪽창(로그인, 회원가입, 로그아웃  들어갈 위치)
        </div>
    );
};

export default Header;
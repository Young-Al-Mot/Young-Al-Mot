import React from 'react';

import Headers from '../components/Header'
import LoginContainer from '../containers/LoginContainer'
import styled from 'styled-components';

const LoginLabel= styled.div`
margin:none;
` 

const Login = () => {
    return (
        <div name= 'Login'>
            <Headers />
            <LoginContainer/>
            
        </div>
    );
};

export default Login;
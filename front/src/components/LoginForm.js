import React from "react";

import styled from "styled-components";
import kotra from './KOTRA_BOLD.ttf';
const LoginLabel = styled.div`
@font-face {
    font-family: kotra;
    src: local("kotra"), url(${kotra});
  }
  font-family: kotra;
  display: flex;
  height: 85vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const StateLabel =styled.div`
  text-align: left;
  width:330px;
  font-size: 18px;
  font-weight: 900;
`;
const UsernameInput = styled.input`
  width:320px;
  height: 50px;
  margin:4px;
  font-size:15px;
`;
const PasswordInput = styled.input`
  width:320px;
  height: 50px;
  margin:4px;
  font-size:15px;
`;
const LoginButton =styled.a`
  display: flex;
  width:200px;
  height: 40px;
  margin-top:30px;
  background-color: gray;
  align-items:center;
  justify-content:center;
`;


const LoginForm = ({
  username,
  password,
  handleChangeUsername,
  handleChangePassword,
  handleSubmit,
  validate,
}) => {
  const handleKeyPress = (e) => {
    if (e.charCode == 13) {
      //엔터치면 로그인되게 함
      handleSubmit();
    }
  };

  return (
    <LoginLabel>
      <StateLabel>로그인</StateLabel>
      
      <UsernameInput
        type="text"
        name="username"
        value={username}
        placeholder="USERNAME"
        onChange={handleChangeUsername}
      />
      <PasswordInput
        type="password"
        value={password}
        placeholder="PASSWORD"
        onChange={handleChangePassword}
        onKeyPress={handleKeyPress}
      />
      <LoginButton onClick={handleSubmit}>로그인 하기</LoginButton>
    </LoginLabel>
  );
};

export default LoginForm;

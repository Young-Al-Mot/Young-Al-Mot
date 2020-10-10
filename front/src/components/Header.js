import React from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

const flexCenterAlign = css`
  display: flex;
  align-items: center;
`;

const HeaderLabel = styled.div`
  border-bottom: solid;
  height: 40px;
  width: 96%;
  margin-left: 2%;
  margin-right: 2%;
  ${flexCenterAlign}
`;

const LogoLabel = styled.span`
  margin-left: 10px;
  font-size: 20px;
  text-align: left;
`;
const AuthLabel = styled.span`
  font-size: 15px;
  text-align: right;
  justify-self: flex-end;
  margin-right: 10px;
`;

const EmptyLabel = styled.span`
  flex: 1;
  height:1px;
`;

const LoginLabel=styled.span`
  margin-right:10px;
`

const RegisterLabel=styled.span`
  margin-left:10px;
`



const Header = () => {
  return (
    <HeaderLabel>
      <LogoLabel>
        <Link style={{ textDecoration: "none" }} to="/">
          영알못
        </Link>
      </LogoLabel>
      <EmptyLabel></EmptyLabel>
      <AuthLabel>
        <LoginLabel>
        <Link style={{ textDecoration: "none" }} to="/login">
          로그인
        </Link>
        </LoginLabel>
        <RegisterLabel>
        <Link style={{ textDecoration: "none" }} to="/register">
          회원가입
        </Link>
        </RegisterLabel>
      </AuthLabel>
    </HeaderLabel>
  );
};

export default Header;

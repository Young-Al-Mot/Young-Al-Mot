import React from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";

import Logout from "./Logout";

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
  height: 1px;
`;
const InAuthLabel = styled.span`
  margin-right: 10px;
`;


const Header = () => {
  const { status } = useSelector((state) => state.auth);

  const unLoginView = (
    <AuthLabel>
      <InAuthLabel>
        <Link style={{ textDecoration: "none" }} to="/login">
          로그인
        </Link>
      </InAuthLabel>
      <InAuthLabel>
        <Link style={{ textDecoration: "none" }} to="/register">
          회원가입
        </Link>
      </InAuthLabel>
    </AuthLabel>
  );

  //이미 로그인 되있으면 유저 이름 뜨게
  const loginView = (
    <AuthLabel>
      <InAuthLabel>{status.currentNickname}님</InAuthLabel>
      <InAuthLabel>
        <Logout/>
      </InAuthLabel>
    </AuthLabel>
  );

  return (
    <HeaderLabel>
      <LogoLabel>
        <Link style={{ textDecoration: "none" }} to="/">
          영알못
        </Link>
      </LogoLabel>
      <EmptyLabel></EmptyLabel>
      {status.isLoggedIn ? loginView : unLoginView}
    </HeaderLabel>
  );
};

export default Header;

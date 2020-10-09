import React from "react";
import { Link } from "react-router-dom";
import styled,{css} from "styled-components";

const flexCenterAlign = css`
    display: flex;
    align-items: center;
`;

const HeaderLabel = styled.div`
  border-bottom: solid;
  height: 40px;
  width: 100%;
  ${flexCenterAlign}
`;

const LogoLabel = styled.span`
  font-size: 20px;
  text-align: left;

`;
const AuthLabel = styled.span`
  font-size: 15px;
  text-align: right;
  justify-self: flex-end;

`;
const EmptyLabel = styled.span`
  flex: 1;
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
        <Link style={{ textDecoration: "none" }} to="/login">
          로그인
        </Link>
        <span> </span>
        <Link style={{ textDecoration: "none" }} to="/register">
          회원가입
        </Link>
      </AuthLabel>
    </HeaderLabel>
  );
};

export default Header;

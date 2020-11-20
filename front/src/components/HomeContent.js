import React from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AllContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
  width: 60%;
  margin-left: 20%;
  margin-right: 20%;
`;
const TopContent = styled.div`
  display: flex;
  justify-content:center;
  align-items: center;
  min-height:50px;
  min-width:100px;
  border: solid thin;
  margin: 5px;
`;
const Gameguide = styled.div`
  height: 300px;
  width: 100%;
  border: solid thin;
  border-top: none;
`;

const HomeContent = () => {
  const { status } = useSelector((state) => state.auth);

  //로그인 되있으면 방입장 뜸
  const login = (
    <div>
      <Link style={{ textDecoration: "none" }} to="/roomList">
        게임시작{" "}
      </Link>
    </div>
  );
  //로그인 안되있으면 로그인 뜸
  const unlogin = (
    <div>
      <Link style={{ textDecoration: "none" }} to="/login">
        로그인{" "}
      </Link>
    </div>
  );

  return (
    <AllContent>
      <TopContent><div>{status.isLoggedIn ? login : unlogin}</div></TopContent>
      <Gameguide>게임소개</Gameguide>
    </AllContent>
  );
};

export default HomeContent;

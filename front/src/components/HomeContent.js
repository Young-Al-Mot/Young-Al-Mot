import React from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";



const AllContent =styled.div`
margin-left:20%;
margin-right:20%;
`

const Gameguide = styled.div`
  height: 300px;
  width: 100%;
  border: solid thin;
  border-top: none;

`;

const BottomContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LeftContent = styled.div`
  display: flex;
  height: 100px;
  width: 200px;
  border: solid thin;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;

const MiddleContent = styled.div`
  height: 300px;
  width: 75%;
  border: solid thin;
  margin: 10px;
`;

const RightContent = styled.div`
  height: 300px;
  width: 200px;
  border: solid thin;
  margin: 10px;
`;

const HomeContent = () => {
  const { status } = useSelector((state) => state.auth);

  //로그인 되있으면 LeftContent에 방입장 뜸
  const login = (
      <div>
          <Link style={{ textDecoration: "none" }} to='/rankroom'>랭킹전 </Link>
          <Link style={{ textDecoration: "none" }} to='/roomList'>일반전 </Link>
      </div>
  );
  //로그인 안되있으면 LeftContent에 로그인 뜸
  const unlogin = (
    <div>
      <Link style={{ textDecoration: "none" }} to="/login">로그인 </Link>
    </div>
  );

  return (
    <AllContent>
      <Gameguide>게임소개</Gameguide>
      <BottomContent>
        <LeftContent>{status.isLoggedIn ? login : unlogin}</LeftContent>
        <MiddleContent>공지사항</MiddleContent>
        <RightContent>랭킹</RightContent>
      </BottomContent>
    </AllContent>
  );
};

export default HomeContent;

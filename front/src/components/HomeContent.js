import React from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import kotra from './KOTRA_BOLD.ttf';

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
  @font-face {
    font-family: kotra;
    src: local("kotra"), url(${kotra});
  }
  font-family: kotra;
  display: flex;
  justify-content:center;
  align-items: center;
  min-height:50px;
  min-width:100px;
  border: solid thin;
  width:180px;
  height:80px;
  margin: 5px;
  font-size:200%;
  background-color:#565273;
`;
const Gameguide = styled.div`
  width: 100%;
  border: solid thin;
  border-top: none;
  font-size:(100%,3.3vw);
  padding-left:10px;
  padding-right:10px;
`;

const HomeContent = () => {
  const { status } = useSelector((state) => state.auth);

  //로그인 되있으면 방입장 뜸
  const login = (
    <div>
      <Link style={{ textDecoration: "none", color:"white" }} to="/roomList">
        게임시작{" "}
      </Link>
    </div>
  );
  //로그인 안되있으면 로그인 뜸
  const unlogin = (
    <div>
      <Link style={{ textDecoration: "none", color:"white" }} to="/login">
        로그인{" "}
      </Link>
    </div>
  );

  const introduce = (
    <div>
      <h1>게임소개</h1>
      <h2> 끝말잇기</h2>
      <h3> - 단어를 적으면 그 단어의 맨 끝 알파벳에 이어서 다음 단어를 적는 게임입니다​</h3>
      <h2>A Stands For</h2>
      <h3> - 제시된 알파벳에 맞는 첫 글자를 가진 단어를 계속해서 적어 나가며 누가 더 많은 점수를 얻는지를 겨루는 게임입니다.​</h3>
      <h2>행맨</h2>
      <h3> - 단어 맞히기 게임 중 하나로, 글자 수만큼 빈칸을 그어 놓고 26개 글자 중 하나를 대면 그 글자가 있을 경우 있는 칸에 있는 대로 다 적어 놓고 없을 경우 라이프를 하나 깎는 게임입니다.​​</h3>
    </div>
  )
  return (
    <AllContent>
      <Gameguide>{introduce}</Gameguide>
      <TopContent><div>{status.isLoggedIn ? login : unlogin}</div></TopContent>
    </AllContent>
  );
};

export default HomeContent;

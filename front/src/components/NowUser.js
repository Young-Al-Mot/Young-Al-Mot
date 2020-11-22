import React from "react";
import styled from "styled-components";
import Crown from "./Crown.png";
import Check from "./Check.png";
import Nope from "./Nope.png";
import modenine from "./MODENINE.TTF";

const Content = styled.div`
  @font-face {
    font-family: modenine;
    src: local("modenine"), url(${modenine});
  }
  font-family: modenine;
  display: flex;
  height: 100%;
  width: 15%;
  flex-direction: column;
  background-color: #8E88BF;
  padding-left:15px;
  border-radius:30px 0px 30px 0px;
  font-size: 20px;
`;
const Child = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  flex: 1;
  flex-direction: row;
`;
const Children1 = styled.div`
  display: flex;
  align-content: left;
  align-items: left;
  flex: 0.5;
  margin-bottom: 10%;
`;
const Children2 = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  flex: 1.5;
  margin-bottom: 10%;
`;
const Children3 = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  flex: 1;
  margin-bottom: 10%;
`;

const NowUser = ({ roomUser, order }) => {
  const userlist = roomUser.map((val) => {
    if (val.ready == 1) {
      return (
        <Child key={val.key}>
          <Children1>
            {val.master ? <img src={Crown} /> : <img src={Nope} />}
          </Children1>
          <Children2>
            {val.user}:{val.score}
          </Children2>
          <Children3>{<img src={Check} />}</Children3>
        </Child>
      );
    } else if (val.user == order) {
      return (
        <Child key={val.key}>
          <Children1>
            {val.master ? <img src={Crown} /> : <img src={Nope} />}
          </Children1>
          <Children2 style={{ color: "#fdcb85" }}>
            {val.user}:{val.score}
          </Children2>
          <Children3></Children3>
        </Child>
      );
    } else {
      return (
        <Child key={val.key}>
          <Children1>
            {val.master ? <img src={Crown} /> : <img src={Nope} />}
          </Children1>
          <Children2>
            {val.user}:{val.score}
          </Children2>
          <Children3></Children3>
        </Child>
      );
    }
  });
  return <Content>{userlist}</Content>;
};

export default NowUser;

import React from "react";
import styled from "styled-components";

const Content = styled.div`
  display: flex;
  height: 100%;
  border: solid thin;
`;

const Child = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  border:solid thin;
`;

const NowUser = ({ roomPlayer }) => {
  const userlist = roomPlayer.map((val) => (
    <Child key={val.id} >  
      {val.user}:{val.user?val.score:""}
    </Child>
  ));
  return <Content>{userlist}</Content>;
};

export default NowUser;

import React from "react";
import styled from "styled-components";

const Out = styled.button`
  width: 150px;
  height: 40px;
  font-size: 18px;
  margin:10px;
`;

const RoomOut = ({ roomOut }) => {
  return <Out onClick={roomOut}>방 나가기</Out>;
};

export default RoomOut;

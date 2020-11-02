import React from "react";
import styled from "styled-components";

const Ready = styled.button`
  width: 150px;
  height: 40px;
  font-size: 18px;
  margin:10px;
`;

const GameReady = ({isReady,handleReadyClick}) => {
  return <Ready onClick={handleReadyClick}>{isReady?"준비완료":"준비하기"}</Ready>;
};

export default GameReady;

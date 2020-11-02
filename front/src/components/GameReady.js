import React from "react";
import styled from "styled-components";

const Ready = styled.button`
  width: 150px;
  height: 40px;
  font-size: 18px;
  margin:10px;
`;

const GameReady = ({text,handleOnclick}) => {
  return <Ready onClick={handleOnclick}>{text}</Ready>;
};

export default GameReady;

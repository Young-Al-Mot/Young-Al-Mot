import React from "react";
import styled from "styled-components";

const Ready = styled.button`
  width: 150px;
  height: 40px;
  font-size: 18px;
  margin:10px;
`;

const GameReady = ({isMaster,isReady,handleReadyClick}) => {
  const text = ()=> {
    if(isMaster){
      return "게임시작";
    }
    else if(isReady){
      return "준비완료";
    }else{
      return "준비하기";
    }
  }
  

  return <Ready onClick={handleReadyClick}>
    {text()}
    </Ready>;
};

export default GameReady;

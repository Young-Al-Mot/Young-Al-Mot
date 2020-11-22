import React from "react";
import styled,{createGlobalStyle} from "styled-components";
import modenine from './MODENINE.TTF'

const Ready = styled.div`
  @font-face {
    font-family: modenine;
    src: local('modenine'),
    url(${modenine});
  }
  font-family: modenine;
  width: min(300px,10vw);
  height: 40px;
  font-size: min(50px,4vw);
  color: white;
`;

const GameReady = ({ isMaster, isReady, handleReadyClick }) => {
  if (isMaster) {
    return <Ready onClick={handleReadyClick}>Game Start</Ready>;
  } else if (isReady) {
    return (
      <Ready onClick={handleReadyClick} style={{ color:'#fdcb85'}}>
        Ready
      </Ready>
    );
  } else {
    return <Ready onClick={handleReadyClick}>Ready</Ready>;
  }
};

export default GameReady;

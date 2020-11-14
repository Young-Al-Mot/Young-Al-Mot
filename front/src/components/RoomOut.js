import React from "react";
import styled from "styled-components";
import modenine from './MODENINE.TTF'

const Out = styled.div`
  @font-face {
    font-family: modenine;
    src: local('modenine'),
    url(${modenine});
  }
  font-family: modenine;
  width: 100px;
  height: 50px;
  font-size: 40px;
  margin-top:50px;
  color: #2f70a8;
`;

const RoomOut = ({ roomOut }) => {
  return <Out onClick={roomOut}>EXIT</Out>;
};

export default RoomOut;
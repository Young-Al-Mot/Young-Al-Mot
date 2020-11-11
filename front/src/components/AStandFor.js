import React from 'react';
import styled from "styled-components";
import { getSocket } from "../socket/SocketFunc";


const AllContent = styled.div`
  display: flex;
  border: solid thin;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;
const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  height: 10%;
  font-size: 45px;
  font-family: sans-serif;
`;
const MidContnet = styled.div`
  height: 20%;
  width: 85%;
  border: solid thin;
  font-size: 200%;
  text-align: center;
`;
const BotContent = styled.div`
  margin-bottom: 10px;
  border: solid thin;
`;


const AStandFor = () => {
    return (
        <AllContent>
            
        </AllContent>
    );
};

export default AStandFor;
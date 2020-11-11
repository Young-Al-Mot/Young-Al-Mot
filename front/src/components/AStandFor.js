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

const AStandFor = () => {
    return (
        <AllContent>
            aaaa
        </AllContent>
    );
};

export default AStandFor;
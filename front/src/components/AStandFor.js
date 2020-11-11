import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
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
  margin-top: 5px;
  height: 10%;
  width: 100%;
  font-size: 18px;
  font-family: sans-serif;
  border-bottom: solid thin;
`;
const TopTopContent = styled.div`
  font-size: 20px;
`;
const TopBotContend = styled.div`
  font-size: 15px;
`;
const MidContnet = styled.div`
  height: 75%;
  width: 85%;
  border: solid thin;
  font-size: 200%;
  text-align: center;
`;
const BotContent = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  height: 5%;
  width: 85%;
  margin-bottom: 10px;
  border: solid thin;
`;

const socket = getSocket();

const AStandFor = ({message}) => {
  const room = useSelector((state) => state.room.room);
  const [startAlp, setstartAlp] = useState("");
  const [round, setround] = useState(1);
  const [answerList, setanswerList] = useState([]);

  useEffect(() => {
    socket.on("gamestart", (gamealp, gameround) => {
      setstartAlp(gamealp);
      setround(gameround);
    });
  });

  useEffect(() => {
    socket.on("standanswer", (word, answer) => {
      //정답이면 화면의 정답리스트에 추가
      if (answer) {
        const tmp = answerList;
        let tmp2 = { word: word, key: tmp.length };
        tmp.unshift(tmp2);
        setanswerList(tmp);
      }
    });
  }, [answerList]);

  const showAnswerList = () => {
    answerList.map((val) => {
      return <div key={val.key}>{val.answer}</div>;
    });
  };

  return (
    <AllContent>
      <TopContent>
        <TopTopContent>시작 알파벳 {startAlp}</TopTopContent>
        <TopBotContend>
          라운드 {round}/{room.maxround}
        </TopBotContend>
      </TopContent>
      <MidContnet>{showAnswerList()}</MidContnet>
      <BotContent>{message}</BotContent>
    </AllContent>
  );
};

export default AStandFor;

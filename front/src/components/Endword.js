import React, { useState, useEffect } from "react";
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
  flex-direction:column;
  justify-content:center;
  align-items:center;
  margin-top: 10px;
  height: 10%;
`;
const TopTopContent = styled.div`
  border: solid thin;
`;
const TopBotContent = styled.div`
  width: 20px;
  height: 20px;
  font-size: 100%;
  border: solid thin;
  margin-top: 10px;
  text-align:center;
`;
const MidContnet = styled.div`
  height: 40%;
  width: 85%;
  border: solid thin;
  font-size: 200%;
`;
const BotContent = styled.div`
  margin-bottom: 10px;
  border: solid thin;
`;

const socket=getSocket();

const Endword = ({ message }) => {
  const [startWord,setstartWord]=useState("");
  const [nowOrder,setnowOrder]=useState(0);
  const [timer,settimer]=useState(5);
  const [round,setround]=useState(0);

  useEffect(()=>{
    socket.on("gamestart", (order,startword,round) => {
      setstartWord(startword);
      setnowOrder(order);
      setround(round);
    });
    socket.off("gametime");
    socket.on("gametime", (time) => {
      settimer(time);
      console.log("timer", time);
    });
  
  })

  return (
    <AllContent>
      <TopContent>
        <TopTopContent>
          {startWord}
          {/* 라운드에 해당하는 글짜를 크게표시하거나 색을 다르게 표시해야함 */}
        </TopTopContent>
        <TopBotContent>{timer}</TopBotContent>
      </TopContent>
      <MidContnet>
        {startWord[round]}
        {/* 이전단어의 마지막 글자 보여줌 / 정답을 엔터or전송 하면 서버에서 확인후
        초록글씨or빨간글씨 로 입력한 단어 표시 */}
      </MidContnet>
      <BotContent>{message}</BotContent>
    </AllContent>
  );
};

export default Endword;

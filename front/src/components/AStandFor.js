import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import { getSocket } from "../socket/SocketFunc";
import ScoreBoarder from "./ScoreBoarder";

const gmaeroundtime = 7;

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
  height: 15%;
  width: 100%;
  font-family: sans-serif;
`;
const TopTopContent = styled.div`
  font-size: 20px;
`;
const TopMidContent = styled.div`
  display: flex;
  justify-content: center;
  font-size: 15px;
  width: 100%;
  border-bottom: solid thin;
`;
const TopBotContent = styled.div`
  height: 25px;
  font-size: 100%;
  margin-top: 10px;
  text-align: center;
`;
const MidContnet = styled.div`
  height: 70%;
  width: 85%;
  border: solid thin;
  font-size: 200%;
  text-align: center;
`;
const BotContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5%;
  width: 85%;
  margin-bottom: 10px;
  border: solid thin;
`;
const ProgressBarWrapper = styled.div`
  border: 2px solid lightblue;
  height: 2vh;
  width: 60vw;
`;
const fill = keyframes`
  0% {width: 0%}
  100% {width: 100%} 
`;
const ProgressBar = styled.div`
  background: lightblue;
  height: 100%;
  animation: ${fill} ${gmaeroundtime}s linear;
  animation-duration: 1;
  animation-direction: reverse;
  animation-fill-mode: forwards;
`;

const socket = getSocket();

const AStandFor = ({
  message,
  timer,
  settimer,
  startAlp,
  nickname,
  isStart,
  roomUser,
  setstartAlp,
  setisStart,
  setgameStart,
  setroomUser,
}) => {
  const room = useSelector((state) => state.room.room);
  const [round, setround] = useState(1);
  const [answerList, setanswerList] = useState([]);
  const [waitTime, setwaitTime] = useState(-1);

  useEffect(() => {
    socket.on("standstart", (gamealp, gameround) => {
      console.log("startalp", gamealp);
      setstartAlp(gamealp);
      setround(gameround);
      setisStart(1); //게임중인거 나타냄
      setgameStart(0); //방장 게임 시작버튼 비활성화

      //게임 시작하기 전에 3 2 1 게임시작 표시해줌
      //(서버에서도 gamestart이벤트 보내고 4초뒤 게임 시작함)
      let i = 3;
      setwaitTime(i);
      const tmp = setInterval(() => {
        i -= 1;
        setwaitTime(i);
        if (i == -1) {
          clearInterval(tmp);
        }
      }, 1000);
    });

    socket.off("standtime");
    socket.on("standtime", (time) => {
      settimer(time);
    });

    socket.on("standend", (val) => {
      console.log("gameend");
      let tmp = [];
      for (let i = 0; i < val.length; i++) {
        let nowname = val[i].user_name;
        tmp.push({
          user: nowname,
          score: val[i].score,
          key: i,
          ready: val[i].ready,
          master: val[i].master,
        });
      }

      setisStart(-1); //스코어 화면표시는 -1
      setround(0);

      setroomUser(tmp);
    });

  });

  useEffect(() => {
    socket.on("standanswer", (word, answer, answeruser) => {
      if (nickname == answeruser) {
 
        //정답이면 화면의 정답리스트에 추가
        if (answer) {
          console.log("정답",word);
          const tmp = answerList;
          let tmp2 = { answer: word, key: tmp.length };
          tmp.unshift(tmp2);
          console.log("tmp",tmp);
          setanswerList(tmp);
        }
      }
    });
  }, [answerList]);

  const showScoreBoarder = () => {
    console.log("isstart",isStart)
    if (isStart == -1)
      return (
        <ScoreBoarder
          setisStart={setisStart}
          roomUser={roomUser}
          setroomUser={setroomUser}
        />
      );
    else return;
  };

  const showAnswerList = () => {
    answerList.map((val) => {
      return <div key={val.key}>{val.answer}</div>;
    });
  };

  const timerBar = () => {
    if (timer <= gmaeroundtime && timer > 0) {
      return (
        <ProgressBarWrapper>
          <ProgressBar />
        </ProgressBarWrapper>
      );
    } else if (timer == 0) {
      return (
        <ProgressBarWrapper>
          {/* 0이 아닐때( -1이면 아무것도안함 -1이아니면 시간출력) 0이맞으면 "게임시작" 출력 */}
          {waitTime != 0 ? (waitTime == -1 ? true : waitTime) : "게임시작"}
        </ProgressBarWrapper>
      );
    }
  };

  return (
    <AllContent>
      <TopContent>
        <TopTopContent>시작 알파벳 {startAlp}</TopTopContent>
        <TopMidContent>
          라운드 {round}/{room.maxround}
        </TopMidContent>
        <TopBotContent>{timerBar()}</TopBotContent>
      </TopContent>
      <MidContnet>{showAnswerList()}</MidContnet>
      <BotContent>{message}</BotContent>
      {showScoreBoarder()}
    </AllContent>
  );
};

export default AStandFor;

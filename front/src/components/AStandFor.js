import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import { getSocket } from "../socket/SocketFunc";
import ScoreBoarder from "./ScoreBoarder";
import modenine from "./MODENINE.TTF";

const gmaeroundtime = 20;

const AllContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;
const TopContent = styled.div`
  @font-face {
    font-family: modenine;
    src: local("modenine"), url(${modenine});
  }
  font-family: modenine;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
  height: 20%;
  width: 100%;
  font-family: sans-serif;
`;
const TopTopContent = styled.div`
  font-size: 30px;
  text-transform:uppercase;
  margin-bottom:5px;
`;
const TopMidContent = styled.div`
  display: flex;
  justify-content: center;
  font-size: 15px;
  width: 100%;
`;
const TopBotContent = styled.div`
  @font-face {
    font-family: modenine;
    src: local("modenine"), url(${modenine});
  }
  font-family: modenine;
  height: 25px;
  font-size: 120%;
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
`;
const MidContent = styled.div`
  @font-face {
    font-family: modenine;
    src: local("modenine"), url(${modenine});
  }
  font-family: modenine;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  overflow: auto;
  height: 70%;
  width: 55%;
  border: solid thin;
  font-size: 200%;
  background-color: #2f70a8;
  color: white;
  border-radius:50px;
`;
const MidContent1 = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
`;
const MidContent2 = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  text-align: center;
`;

const BotContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
  width: 50%;
  font-size:130%;
  padding-top:1%;
  margin-bottom:4%;
`;
const ProgressBarWrapper = styled.div`
  height: 1vh;
  width: 25vw;
  background-color: ${props => props.colors};
  text-align: center;
`;
const fill = keyframes`
  0% {width: 0%}
  100% {width: 100%} 
`;

const ProgressBar = styled.div`
  background-color: #fdcb85;
  height: 100%;
  animation: ${fill} 20s linear;
  animation-duration: 1;
  animation-direction: reverse;
  animation-fill-mode: forwards;
`;

const socket = getSocket();

const AStandFor = ({
  message,
  timer,
  startAlp,
  nickname,
  roomUser,
  isStart,
  answerList,
  round,
  settimer,
  setstartAlp,
  setisStart,
  setgameStart,
  setroomUser,
  setanswerList,
  setround,
  readybutton,
  setisReady,
}) => {
  const room = useSelector(state => state.room.room);
  const [waitTime, setwaitTime] = useState(-1);
  const [wrongWord, setwrongWord] = useState("");

  //start,time,end소켓
  useEffect(() => {
    socket.off("standstart");
    socket.on("standstart", (gamealp, gameround) => {
      console.log("startalp", gamealp);
      setstartAlp(gamealp);
      setround(gameround);
      setisStart(1); //게임중인거 나타냄
      setgameStart(0); //방장 게임 시작버튼 비활성화
      setisReady(0);

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
    socket.on("standtime", time => {
      settimer(time);
    });

    socket.off("standend");
    socket.on("standend", val => {
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
      setstartAlp("");
      setanswerList([]);
      setround(1);
      setroomUser(tmp);
    });
  });

  //answer소켓
  useEffect(() => {
    socket.off("standanswer");
    socket.off("standanswer");
    socket.on("standanswer", (word, answer, answeruser) => {
      console.log("게임중인가",isStart);
      if (nickname == answeruser && isStart==1) {
        //정답이면 화면의 정답리스트에 추가
        if (answer) {
          console.log("정답", word);
          const tmp = answerList;
          let tmp2 = { answer: word, key: tmp.length };
          tmp.push(tmp2);
          console.log("tmp", tmp);
          setanswerList(tmp);
        } else {
          //틀릴경우
          setwrongWord(word);
          const tmp = setInterval(() => {
            setwrongWord("");
            clearInterval(tmp);
          }, 1000);
        }
      }
    });
  }, [answerList,isStart]);

  const showScoreBoarder = () => {
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

  const showAnswerList = answerList.map(val => {
    if (val.key == answerList.length - 1) {
      return (
        <div key={val.key} style={{ margin: "5px", color: "#97cfcb"}}>
          {val.answer}
        </div>
      );
    }
    return (
      <div key={val.key} style={{ margin: "5px" }}>
        {val.answer}
      </div>
    );
  });

  const timerBar = () => {
    if (timer <= gmaeroundtime && timer > 0) {
      return (
        <ProgressBarWrapper colors="gray">
          <ProgressBar />
        </ProgressBarWrapper>
      );
    } else if (timer == 0) {
      return (
        <ProgressBarWrapper>
          {/* 0이 아닐때( -1이면 아무것도안함 -1이아니면 시간출력) 0이맞으면 "게임시작" 출력 */}
          {waitTime != 0 ? (waitTime == -1 ? true : waitTime) : "GO!"}
        </ProgressBarWrapper>
      );
    }
  };

  const showWrongWord = <div style={{ color: "red" }}>{wrongWord}</div>;

  return (
    <AllContent>
      <TopContent>
        <TopTopContent>Start Word [{startAlp}]</TopTopContent>
        <TopMidContent>
          Round {round}/{room.maxround}
        </TopMidContent>
        <TopBotContent>{timerBar()}</TopBotContent>
      </TopContent>
      <MidContent>
        <MidContent1>{showAnswerList}</MidContent1>
        <MidContent2>{readybutton()}</MidContent2>
      </MidContent>
      <BotContent>{showWrongWord}</BotContent>
      {showScoreBoarder()}
    </AllContent>
  );
};

export default AStandFor;

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { getSocket } from "../socket/SocketFunc";
import ScoreBoarder from "./ScoreBoarder";

const AllContent = styled.div`
  display: flex;
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
  margin-top: 100px;
  margin-bottom: 30px;
  height: 10%;
  font-size: 45px;
  font-family: sans-serif;
`;
const TopTopContent = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  padding-bottom: 5px;
  text-align: center;
  width: 300px;
  border-bottom: 1px solid black;
`;
const MiddleBotContent = styled.div`
  margin-bottom: 180px;
  height: 25px;
  font-size: 100%;
  text-align: center;
`;
const MidContent = styled.div`
  height: 20%;
  width: 50%;
  margin-bottom: 10px;
  border: solid thin;
  font-size: 200%;
  text-align: center;
`;

const BotContent = styled.div`
  border: solid thin;
  text-align: center;
  font-family: sans-serif;
  width: 50%;
  height: 10%;
  font-size: 2em;
  overflow: hidden;
  margin-bottom:10px;
`;

const ProgressBarWrapper = styled.div`
  height: 1vh;
  width: 35vw;
  background-color: ${props=>props.colors};
`;
const fill = keyframes`
  0% {width: 0%}
  100% {width: 100%} 
`;

const ProgressBar = styled.div`
  background-color: blue;
  height: 100%;
  animation: ${fill} 5s linear;
  animation-duration: 1;
  animation-direction: reverse;
  animation-fill-mode: forwards;
`;


const socket = getSocket();

const Endword = ({
  message,
  word,
  startWord,
  round,
  timer,
  order,
  roomUser,
  isStart,
  settimer,
  setround,
  setstartWord,
  setword,
  setorder,
  setisStart,
  setgameStart,
  setroomUser,
  readybutton,
}) => {
  const [answerSuccess, setanswerSuccess] = useState(0);
  const [waitTime, setwaitTime] = useState(-1);

  useEffect(() => {
    //게임 시작할때 순서인사람 닉네임, 전체라운드 단어, 라운드
    socket.on("gamestart", (order, startword, gameround) => {
      setorder(order); //순서인사람 닉네임
      setisStart(1); //게임중인거 나타냄
      setgameStart(0); //방장 게임 시작버튼 비활성화
      setstartWord(startword);

      //라운드 시작할때 전체 라운드 단어중 라운드에 해당하는 인덱스 단어 세팅
      setword(startword[gameround]);
      setround(gameround);

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

    socket.off("gameanswer");
    socket.on("gameanswer", (word, order, answer, failword) => {
      setorder(order); //순서인사람 닉네임
      if (answer) {
        //정답일경우
        setword(word);
        settimer(0);
        setanswerSuccess(1);
      } else {
        //틀리면 빨간글씨로 틀린거 보여줌
        console.log(failword);
        setword(failword);
        setanswerSuccess(0);
        var wrongword = setInterval(() => {
          //틀린거 보여주고 0.5초뒤에 원래대로 복구
          setword(word[word.length - 1]);
          setanswerSuccess(1);
          clearInterval(wrongword);
        }, 500);
      }
      console.log("다음순서", order);
    });
    socket.off("gametime");
    socket.on("gametime", time => {
      settimer(time);
      setword(word[word.length - 1]);
    });

    socket.on("gameend", val => {
      let tmp = [];
      let tmp2 = [];
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
      setword("");
      setstartWord("");
      setorder("");
      setround(0);

      setroomUser(tmp);
    });
  });

  const timerBar = () => {
    if (timer <= 5 && timer > 0) {
      return (
        <ProgressBarWrapper colors='gray'>
          <ProgressBar />
        </ProgressBarWrapper>
      );
    } else if (timer == 0) {
      return (
        <ProgressBarWrapper colors='white'>
          {/* 0이 아닐때( -1이면 아무것도안함 -1이아니면 시간출력) 0이맞으면 "게임시작" 출력 */}
          {waitTime != 0 ? (waitTime == -1 ? true : waitTime) : "게임시작"}
        </ProgressBarWrapper>
      );
    }
  };

  const wordColor = () => {
    if (word == undefined) return;
    if (word.length > 1) {
      if (answerSuccess) return <div style={{ color: "green" }}>{word}</div>;
      else {
        return <div style={{ color: "red" }}>{word}</div>;
      }
    } else if (word.length == 1) {
      return <div>{word}</div>;
    }
  };

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

  const showMessage = () => {
    if (order == roomUser.user) {
      return <BotContent>{message}</BotContent>;
    } else {
      return <BotContent>{message}</BotContent>;
    }
  };
  return (
    <AllContent>
      <TopContent>
        <TopTopContent>
          {startWord}
          {/* 라운드에 해당하는 글짜를 크게표시하거나 색을 다르게 표시해야함 */}
        </TopTopContent>
      </TopContent>
      <MidContent>
        {wordColor()}
        {readybutton()}
        {/* 이전단어의 마지막 글자 보여줌 / 정답을 엔터or전송 하면 서버에서 확인후
        초록글씨or빨간글씨 로 입력한 단어 표시 */}
      </MidContent>
      <BotContent>{message}</BotContent>
      <MiddleBotContent>{timerBar()}</MiddleBotContent>
      {showScoreBoarder()}
    </AllContent>
  );
};

export default Endword;

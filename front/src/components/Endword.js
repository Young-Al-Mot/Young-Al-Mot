import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
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
const TopTopContent = styled.div`
  margin-top: 20px;
  padding-top: 20px;
`;
const TopBotContent = styled.div`
  height: 25px;
  font-size: 100%;
  margin-top: 10px;
  text-align: center;
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

const ProgressBarWrapper = styled.div`
  margin: 30px;
  border: 2px solid lightblue;
  height: 5vh;
  width: 60vw;
`;
const fill = keyframes`
  0% {width: 0%}
  100% {width: 100%} 
`;

const ProgressBar = styled.div`
  background: lightblue;
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
  settimer,
  setround,
  setstartWord,
  setword,
  setorder,
  setisStart,
}) => {
  const [answerSuccess, setanswerSuccess] = useState(0);
  const [waitTime, setwaitTime] = useState(-1);

  useEffect(() => {
    socket.on("gamestart", (order, startword, gameround) => {
      setorder(order); //순서인사람 닉네임
      setisStart(1);
      setstartWord(startword);
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
    socket.on("gametime", (time) => {
      settimer(time);
      setword(word[word.length - 1]);
      console.log("timer", time);
    });
  });

  const timerBar = () => {
    if (timer <= 5 && timer > 0) {
      console.log("time5");
      return (
        <ProgressBarWrapper>
          <ProgressBar />
        </ProgressBarWrapper>
      );
    } else if (timer == 0) {
      console.log("time0");
      return (
        <ProgressBarWrapper>
          {/* 0이 아닐때( -1이면 아무것도안함 -1이아니면 시간출력) 0이맞으면 "게임시작" 출력 */}
          {waitTime != 0 ? (waitTime == -1 ? true : waitTime) : "게임시작"}
        </ProgressBarWrapper>
      );
    }
  };

  const wordColor = () => {
    if (word.length > 1) {
      if (answerSuccess) return <div style={{ color: "green" }}>{word}</div>;
      else {
        return <div style={{ color: "red" }}>{word}</div>;
      }
    } else if (word.length == 1) {
      return <div>{word}</div>;
    }
  };

  return (
    <AllContent>
      <TopContent>
        <TopTopContent>
          {startWord}
          {/* 라운드에 해당하는 글짜를 크게표시하거나 색을 다르게 표시해야함 */}
        </TopTopContent>
        <TopBotContent>{timerBar()}</TopBotContent>
      </TopContent>
      <MidContnet>
        {wordColor()}
        {/* 이전단어의 마지막 글자 보여줌 / 정답을 엔터or전송 하면 서버에서 확인후
        초록글씨or빨간글씨 로 입력한 단어 표시 */}
      </MidContnet>
      <BotContent>{message}</BotContent>
    </AllContent>
  );
};

export default Endword;

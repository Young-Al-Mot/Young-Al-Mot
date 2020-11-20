import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { getSocket } from "../socket/SocketFunc";
import ScoreBoarder from "./ScoreBoarder";
import modenine from "./MODENINE.TTF";

let gameroundtime = 7;

const AllContent = styled.div`
  @font-face {
    font-family: modenine;
    src: local("modenine"), url(${modenine});
  }
  font-family: modenine;
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
  margin-top: 70px;
  margin-bottom: 60px;
  height: 5%;
  font-size: 45px;
`;
const TopTopContent = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  padding-bottom: 5px;
  text-align: center;
  justify-content: center;
  width: 300px;
`;
const TopBottomContent = styled.div`
  margin-bottom: 40px;
  margin-top: 10px;
`;
const MiddleBotContent = styled.div`
  margin-bottom: 100px;
  height: 25px;
  font-size: 100%;
  text-align: center;
`;
const MidContent = styled.div`
  display: flex;
  height: 60%;
  width: 40%;
  margin-bottom: 10px;
  background-color: #2f70a8;
  border-radius: 50px 0px 50px 0px;
  font-size: 300%;
  justify-content: center;
  align-items: center;
  color: white;
`;
const MidContent2 = styled.div`
  text-align: center;
`;
const BotContent = styled.div`
  text-align: center;
  font-family: sans-serif;
  width: 40%;
  height: 35%;
  font-size: 2em;
  background-color: #2f70a8;
  border-radius: 15px;
  margin-top: 10px;
`;

const BotContent2 = styled.div`
  text-align: center;
  margin-left: 5%;
  margin-top: 1.5%;
  width: 90%;
  height: 65%;
  background-color: white;
  font-size: 0.8em;
  border-radius: 15px;
  overflow: hidden;
`;

const ProgressBarWrapper = styled.div`
  height: 1vh;
  width: 25vw;
  background-color: ${props => props.colors};
  text-align: center;
  font-size: 80%;
`;
const fill = keyframes`
  0% {width: 0%}
  100% {width: 100%} 
`;

const ProgressBar = styled.div`
  background-color: #fdcb85;
  height: 100%;
  animation: ${fill} ${props=>props.gameroundtime}s linear;
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
  setisReady,
  count,
}) => {
  const [answerSuccess, setanswerSuccess] = useState(0);
  const [waitTime, setwaitTime] = useState(-1);

  useEffect(() => {
    gameroundtime = count;
  }, [round]);

  useEffect(() => {
    //게임 시작할때 순서인사람 닉네임, 전체라운드 단어, 라운드
    socket.off("gamestart");
    socket.on("gamestart", (order, startword, gameround) => {
      setorder(order); //순서인사람 닉네임
      setisStart(1); //게임중인거 나타냄
      setgameStart(0); //방장 게임 시작버튼 비활성화
      setstartWord(startword);
      setisReady(0);

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

    socket.off("gametime");
    socket.on("gametime", time => {
      settimer(time);
      setword(word[word.length - 1]);
    });

    socket.off("gameend");
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

  //gameanswer소켓
  useEffect(() => {
    socket.off("gameanswer");
    socket.on("gameanswer", (word, order, answer, failword) => {
      console.log("게임중인가", isStart);
      if (isStart == 1) {
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
      }
    });
  }, [isStart]);

  const timerBar = () => {
    if (timer <= gameroundtime && timer > 0 && isStart == 1) {
      return (
        <ProgressBarWrapper colors="gray">
          <ProgressBar gameroundtime={gameroundtime}/>
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

  const wordColor = () => {
    if (word == undefined) return;
    if (isStart == 1) {
      if (word.length > 1) {
        if (answerSuccess)
          return <div style={{ color: "#97cfcb" }}>{word}</div>;
        else {
          return <div style={{ color: "red" }}>{word}</div>;
        }
      } else if (word.length == 1) {
        return <div>{word}</div>;
      }
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

  const showStartWord = () => {
    let i = 0;
    const tmp = [];
    for (i = 0; i < startWord.length; i++) {
      if (round == i) {
        tmp.push(<div style={{ color: "red" }}>{startWord[i]}</div>);
      } else {
        tmp.push(<div>{startWord[i]}</div>);
      }
    }
    return tmp;
  };

  return (
    <AllContent>
      <TopContent>
        <TopTopContent>{showStartWord()}</TopTopContent>
        <TopBottomContent>{timerBar()}</TopBottomContent>
      </TopContent>
      <MidContent>
        {wordColor()}
        <MidContent2>{readybutton()}</MidContent2>
        {/* 이전단어의 마지막 글자 보여줌 / 정답을 엔터or전송 하면 서버에서 확인후
        초록글씨or빨간글씨 로 입력한 단어 표시 */}
      </MidContent>
      <BotContent>
        <BotContent2>{message}</BotContent2>
      </BotContent>
      <MiddleBotContent></MiddleBotContent>
      {showScoreBoarder()}
    </AllContent>
  );
};

export default Endword;

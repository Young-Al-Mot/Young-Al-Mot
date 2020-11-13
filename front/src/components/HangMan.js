import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import { getSocket } from "../socket/SocketFunc";
import ScoreBoarder from "./ScoreBoarder";

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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  height: 10%;
  width: 100%;
  font-family: sans-serif;
`;

const TopChildContent = styled.div`
  margin: 8px;
  border-bottom: solid thin;
  width: 25px;
  height: 25px;
  text-align: center;
`;

const MidContnet = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: auto;
  height: 70%;
  width: 85%;
  font-size: 200%;
`;
const MidMainContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 85%;
`;
const MidSubContnet = styled.div`
  width: 15%;
  font-size: 18px;
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

const socket = getSocket();

const HangMan = ({
  message,
  roomUser,
  isStart,
  round,
  word,
  order,
  setroomUser,
  setisStart,
  setgameStart,
  setround,
  setword,
  setorder,
}) => {
  const room = useSelector((state) => state.room.room);
  const [alp, setalp] = useState([]);
  const [failAlp, setfailAlp] = useState([]); //틀렷던 알파벳,단어
  const [life, setlife] = useState(7);

  //start,end소켓
  useEffect(() => {
    socket.off("hangstart");
    //순서인사람닉네임,정답단어,라운드
    socket.on("hangstart", (gameorder, gameword, gameround) => {
      console.log("hangstart");
      setisStart(1); //게임중인거 나타냄
      setgameStart(0); //방장 게임 시작버튼 비활성화

      setfailAlp([]);
      setorder(gameorder);
      setround(gameround);
      setword(gameword);
      let i = 0;
      const tmp = [];
      for (i = 0; i < gameword.length; i++) {
        tmp.push({ key: i, alp: "" });
      }
      setalp(tmp); //단어 배열로 설정
    });

    socket.off("hangend");
    socket.on("hangend", (val) => {
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
      setround(1);

      setroomUser(tmp);
    });
  });

  //정답 맞췃을때 틀렷을때, 순서인사람이 나갓을때
  useEffect(() => {
    socket.off("hanganswer");
    socket.on(
      "hanganswer",
      (isAnswer, gamealp, nextuser, gamelife, answeridx) => {
        //알파벳 정답일경우
        if (isAnswer == 1) {
          const tmp = alp;
          //상단 알파벳 배열에 맞춘 알파벳 업데이트
          answeridx.map((val) => {
            tmp[val].alp = gamealp;
          });
          setalp(tmp);
          setorder(nextuser);
        } else if (isAnswer == 0) {
          //단어,알파벳 틀린경우
          const tmp = failAlp;
          tmp.push({ key: tmp.length, alp: gamealp });
          setfailAlp(tmp);
          setlife(gamelife);
          setorder(nextuser);
        } else if (isAnswer == -1) {
          //순서인사람이 나갔을때
          setorder(nextuser);
        }
        //단어 정답일경우 바로 gameend이벤트 발생하니 여기서 처리X
      }
    );
  }, [failAlp, alp]);

  const showAlp = () => {
    return alp.map((val) => {
      return <TopChildContent key={val.key}>{val.alp}</TopChildContent>;
    });
  };

  const showFailAlp = failAlp.map((val) => {
    return <div key={val.key}>{val.alp}</div>;
  });

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

  return (
    <AllContent>
      <TopContent>
        {showAlp()}
        {/* 맞춘 알파벳 보여줌 */}
      </TopContent>
      <MidContnet>
        <MidSubContnet>
          {showFailAlp}
          {/* 틀렷던 알파벳,단어 보여줌 */}
        </MidSubContnet>
        <MidMainContent>
          {life}
          {/* 행맨 그림 보여줌 */}
        </MidMainContent>
      </MidContnet>
      <BotContent>{message}</BotContent>
      {showScoreBoarder()}
    </AllContent>
  );
};

export default HangMan;

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import { getSocket } from "../socket/SocketFunc";
import ScoreBoarder from "./ScoreBoarder";
import modenine from "./MODENINE.TTF";

const AllContent = styled.div`
  @font-face {
    font-family: modenine;
    src: local("modenine"), url(${modenine});
  }
  font-family: modenine;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: flex-end;
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
  width: min(25px, 3.3vw);
  height: min(25px, 3.3vw);
  text-align: center;
`;

const MidContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  overflow: hidden;
  height: 55%;
  width: 55%;
  font-size: 200%;
  background-color: #565273;
`;

const MidTopContent = styled.div`
  margin-left: 40%;
  display: flex;
  justify-content: center;
`;

const MidMainContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
`;
const MidSubContent = styled.div`
  width: 15%;
  font-size: min(18px, 3vw);
  color: white;
`;
const BotContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5%;
  width: 85%;
  margin-bottom: 10px;
`;

const LifeContent = styled.div`
  display: flex;
  width: 60%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const LifeContent2 = styled.div`
  display: flex;
  margin-right: min(20px, 3vw);
  background-color: ${(props) => props.backcolor};
  color: ${(props) => props.color};
  font-size: min(150%, 3.3vw);
`;

const socket = getSocket();

const HangMan = ({
  message,
  roomUser,
  isStart,
  round,
  word,
  order,
  alp,
  setroomUser,
  setisStart,
  setgameStart,
  setround,
  setword,
  setorder,
  setalp,
  setisReady,
  readybutton,
}) => {
  const room = useSelector((state) => state.room.room);

  const [failAlp, setfailAlp] = useState([]); //틀렷던 알파벳,단어
  const [lifeAlp, setlifeAlp] = useState([]);
  const [life, setlife] = useState(10);
  const [roundend, setroundend] = useState(false);

  //start,end소켓
  useEffect(() => {
    socket.off("hangstart");
    //순서인사람닉네임,정답단어,라운드
    socket.on("hangstart", (gameorder, gameword, gameround) => {
      console.log("hangstart");
      setisStart(1); //게임중인거 나타냄
      setgameStart(0); //방장 게임 시작버튼 비활성화
      setisReady(0);
      setroundend(false);
      setlife(10);
      setfailAlp([]);
      setorder(gameorder);
      setround(gameround);
      setword(gameword);
      let i = 0;
      const tmp = [];
      const tmp2 = [];
      for (i = 0; i < gameword.length; i++) {
        tmp.push({ key: i, alp: "" });
        tmp2.push({ key: i, alp: gameword[i] });
      }
      setalp(tmp); //단어 배열로 설정
      setword(tmp2);
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

      setroundend(false);
      setisStart(-1); //스코어 화면표시는 -1
      setround(1);
      setfailAlp([]);
      setalp([]);
      setorder("");
      setlife(10);
      setroomUser(tmp);
    });
  });

  //정답 맞췃을때 틀렷을때, 순서인사람이 나갓을때
  useEffect(() => {
    socket.off("hanganswer");
    socket.on(
      "hanganswer",
      (isAnswer, gamealp, nextuser, gamelife, answeridx) => {
        //라운드 끝낫을때 정답 표시해줌
        if (gamelife == 0) {
          setroundend(true);
        }

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
    if (roundend) {
      return word.map((val) => {
        return <TopChildContent key={val.key}>{val.alp}</TopChildContent>;
      });
    } else {
      return alp.map((val) => {
        return <TopChildContent key={val.key}>{val.alp}</TopChildContent>;
      });
    }
  };

  const lifebar = () => {
    let i = 0;
    const tmp = [];
    if (isStart === 1) {
      tmp.push(<LifeContent2>Life : </LifeContent2>);
      for (i = 0; i < 10; i++) {
        if (i < life) {
          tmp.push(
            <LifeContent2 backcolor="#97cfcb" color="#97cfcb">
              　
            </LifeContent2>
          );
        } else {
          tmp.push(
            <LifeContent2 backcolor="white" color="white">
              　
            </LifeContent2>
          );
        }
      }
    }
    return tmp;
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
      <LifeContent>{lifebar()}</LifeContent>
      <MidContent>
        <MidTopContent>{readybutton()}</MidTopContent>
        <MidSubContent>
          {showFailAlp}
          {/* 틀렷던 알파벳,단어 보여줌 */}
        </MidSubContent>
        <MidMainContent></MidMainContent>
      </MidContent>
      <BotContent></BotContent>
      {showScoreBoarder()}
    </AllContent>
  );
};

export default HangMan;

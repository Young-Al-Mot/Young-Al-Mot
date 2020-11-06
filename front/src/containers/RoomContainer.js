import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { buttons } from "polished";

import RoomChat from "../components/RoomChat";
import RoomOut from "../components/RoomOut";
import { roomOutRequest } from "../modules/room";
import GameReady from "../components/GameReady";
import NowUser from "../components/NowUser";
import { getSocket } from "../socket/SocketFunc";

import Endword from "../components/Endword";

const AllContent = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const ChatName = styled.span`
  display: flex;
  width: 20%;
  min-width: 220px;
  align-items: center;
  justify-content: center;
  border-right: solid thin;
`;
const ChatMessage = styled.span`
  width: 80%;
  padding-left: 5px;
  word-break: break-all;
`;
const ChatBodyContent = styled.div`
  display: flex;
  border-bottom: solid thin;
  max-width: 100%;
`;
const TopContent = styled.div`
  height: 5%;
`;
const BodyContent = styled.div`
  margin: 15px;
  height: 60%;
`;
const BottomContent = styled.div`
  height: 35%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const BotLeft = styled.div`
  flex: 1;
  margin-bottom: 1%;
`;
const BotMid = styled.div`
  height: 99%;
  flex: 3;
  margin-bottom: 1%;
`;
const BotRight = styled.div`
  flex: 1;
  margin-bottom: 1%;
`;

//서버 주소
const socket = getSocket();

const RoomContainer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.status);
  const room = useSelector((state) => state.room.room);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [allmessage, setAllmessage] = useState("");
  const [isReady, setisReady] = useState(false);
  const [roomUser, setroomUser] = useState([
    { user: user.currentNickname, score: "", key: 0, ready: 0, master: 1 },
  ]);
  const [isMaster, setisMaster] = useState(0);
  const [gameStart, setgameStart] = useState(0); //이게 1일때 방장이 시작누르면 게임시작할수있음
  const [playerScore, setplayerScore] = useState({}); //"유저이름":점수 이런식으로 관리
  const [isStart, setisStart] = useState(0); //게임중인지 아닌지 나타냄

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  //게임준비, 게임시작
  const handleReadyClick = (e) => {
    console.log("click ready");
    if (isMaster) {
      if (gameStart) {
        //게임시작 누르면 소켓에 알림(방번호, 게임타입)
        socket.emit("gamestart", room.roomid,room.gametype);
      } else {
        alert("플레이어가 모두 준비를 완료해야 합니다");
      }
    } else {
      axios({
        method: "POST",
        url: "http://localhost:5000/ready",
        data: {
          nickname: user.currentNickname,
          roomid: room.roomid,
        },
      })
        .then((res) => {
          setisReady(res.data.ready);
        })
        .catch((e) => {
          console.log("서버와 통신에 실패했습니다");
        });
    }
  };

  //msg소켓 보내는거
  const send = (e) => {
    if (message != "") {
      socket.emit("msg", {
        roomno: room.roomid,
        name: user.currentNickname,
        message: message,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("gamestart", () => {
      setisStart(1);
    });

    //새로고침하면 방 나가게 됨
    //새로고침으로 리듀서 초기화되면 roomid 0되니까 그거이용
    if (room.roomid == 0) {
      history.push("/roomList");
    }

    //뒤로가기 막는거
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      history.go(1);
    };

    //창 닫거나 새로고침할때 이벤트
    window.onbeforeunload = (e) => {
      e.returnValue = "";
      return "";
    };

    //ctrl+w했을때 이벤트
    window.onkeydown = logKey;
    function logKey(e) {
      if (e.ctrlKey && e.key === "w") {
        dispatch(roomOutRequest(user.currentUser));
      }
    }
  });

  //마운트 되었을때
  useEffect(() => {
    console.log("roomcontainer mount");
    //msg소켓 받는거
    socket.on("msg", (obj) => {
      console.log("msg");
      const logs2 = logs;
      obj.key = "key_" + (logs.length + 1);
      logs2.unshift(obj); // 로그에 추가하기
      setLogs(logs2);
      const tmp = logs.map((e) => (
        <ChatBodyContent key={e.key}>
          <ChatName>{e.name}</ChatName>
          <ChatMessage>{e.message}</ChatMessage>
        </ChatBodyContent>
      ));
      setAllmessage(tmp);
    });
  }, [logs]);

  //join 소켓
  //roomUser관리(레디,점수,방장.입장,퇴장 이 바뀔때 업데이트됨)
  useEffect(() => {
    //join이벤트 받으면 소켓에서 현재 유저정보 받아서 배열로 만들어서 넣어줘
    //ready해도 여기서 처리함 (ready 0은 레디 안한거 1은 레디한거)
    socket.off("join"); //왜인지 모르겟지만 2번 실행되길레 한번 꺼줌(어디서 실행되는지 모르겟음)
    socket.on("join", (val) => {
      console.log("join", val);
      let tmp = [];
      let readynum = 0;
      for (let i = 0; i < val.length; i++) {
        let nowname = val[i].user_name;

        if (val[i].ready) readynum += 1;
        if (val[i].master == 1 && user.currentNickname == val[i].user_name) {
          console.log("getmaster");
          setisMaster(1);
        }
        tmp.push({
          user: nowname,
          score: playerScore[nowname],
          key: i,
          ready: val[i].ready,
          master: val[i].master,
        });
      }
      //일단 혼자있을때는 시작안되게했음
      if (readynum == val.length - 1 && readynum != 0) setgameStart(1);
      else setgameStart(0);

      if (tmp.length != 0) setroomUser(tmp);
    });
  }, [roomUser]);


  const roomOut = () => {
    socket.disconnect();
    history.push("/roomList");
  };

  const game = () => {
    if (room.gametype == "끝말잇기") {
      return <Endword message={message}/>;
    }
    
  };

  const readybutton = () => {
    if (isStart) {
      return;
    } else {
      return (
        <GameReady
          isMaster={isMaster}
          isReady={isReady}
          handleReadyClick={handleReadyClick}
        />
      );
    }
  };

  return (
    <AllContent>
      <TopContent>
        <NowUser roomUser={roomUser} />
      </TopContent>
      <BodyContent>{game()}</BodyContent>

      <BottomContent>
        {/* 채팅, 나가기 */}
        <BotLeft>{readybutton()}</BotLeft>
        <BotMid>
          <RoomChat
            user={user}
            message={message}
            roomid={room.roomid}
            handleChangeMessage={handleChangeMessage}
            send={send}
            setLogs={setLogs}
            allmessage={allmessage}
          />
        </BotMid>
        <BotRight>
          <RoomOut roomOut={roomOut} />
        </BotRight>
      </BottomContent>
    </AllContent>
  );
};

export default RoomContainer;

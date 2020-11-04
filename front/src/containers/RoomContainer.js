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
import getSoket from "../soket/SocketFunc";

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
const socket = getSoket();
const soc=getSoket();

const RoomContainer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.status);
  const room = useSelector((state) => state.room.room);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [isReady, setisReady] = useState(false);
  const [roomPlayer,setroomPlayer]=useState([]);

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleReadyClick = (e) => {
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
  };

  const [allmessage, setAllmessage] = useState("");

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

  //마운트 되었을때
  useEffect(() => {
    //msg소켓 받는거
    socket.on('msg', (obj) => {
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
      console.log("chat", tmp);
    });

  


    //방 들어오면 소켓에서 현재 유저정보 받아서 배열로 만들어서 넣어줘
    let tmp=new Array();
    for(let i=0;i<room.peoplemaxnum;i++){
      tmp.push({user:"",score:0,id:i});
    }
    tmp[0]={user:user.currentNickname,score:0,id:0}
    console.log(tmp);
    setroomPlayer(tmp);

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

    //창 닫을때
    window.onclose=(e)=>{
      e.
      roomOut();
    }

    //창 닫거나 새로고침할때 이벤트
    window.onbeforeunload = (e) => {
      e.returnValue = "";
      return "";
    };

    //ctrl+w했을때 이벤트
    window.onkeydown = logKey;
    function logKey(e){
      if(e.ctrlKey && e.key === 'w'){
        dispatch(roomOutRequest(user.currentUser));
      }
    }
  }, [logs]);

  const roomOut = () => {
    history.push("/roomList");
  };

  return (
    <AllContent>
      <TopContent>
        <NowUser
        roomPlayer={roomPlayer}
        />
      </TopContent>
      <BodyContent>
        {/* 게임화면이나 사용자넣는곳 */}
        게임화면
      </BodyContent>

      <BottomContent>
        {/* 채팅, 나가기 */}
        <BotLeft>
          <GameReady isReady={isReady} handleReadyClick={handleReadyClick} />
        </BotLeft>
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

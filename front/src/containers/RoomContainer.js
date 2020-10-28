import React, { useState, useEffect } from "react";
import socketio from "socket.io-client";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import RoomChat from "../components/RoomChat";

const ChatName = styled.span`
  display:flex;
  flex:1;
  align-items: center;
  justify-content:center;
  border-right: solid thin;
`;

const ChatMessage = styled.span`
  flex:4;
  padding-left:5px;
`;

const BodyContent = styled.div`
  display:flex;
  border-bottom:solid thin;
`;

//서버 주소
const socket = socketio.connect("http://localhost:5000");

const RoomContainer = () => {
  const history = useHistory();
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const user = useSelector((state) => state.auth.status);
  const room =useSelector ((state) => state.room.room);

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };
  const [allmessage, setAllmessage] = useState("");

  const send = (e) => {
    //백엔드 완성되면 수정해야됨
    socket.emit('msg', {
      //roomno: room.roomid,
      roomno: Number(sessionStorage.setRoomId),
      name: user.currentNickname,
      message: message,
    });
    setMessage("");
  };
  //마운트 되었을때
  useEffect(() => {
    //session에 아무것도 없으면 roomList로 이동
    if(sessionStorage.setRoomId === undefined){
      history.push("/roomList");
    }
    // 실시간으로 로그를 받게 설정
    //백엔드 완성되면 수정해야됨
    socket.on(Number(sessionStorage.setRoomId)/*room.roomid*/, (obj) => {
      const logs2 = logs;
      obj.key = "key_" + (logs.length + 1);
      logs2.unshift(obj); // 로그에 추가하기
      setLogs(logs2);
      const tmp = logs.map((e) => (
        <BodyContent key={e.key}>
          <ChatName>{e.name}</ChatName>
          <ChatMessage>{e.message}</ChatMessage>
        </BodyContent>
      ));
      setAllmessage(tmp);
      console.log("chat",tmp);
    });
  }, [logs]);

  console.log((sessionStorage.setRoomId));

  return (
    <div>
      {/* 방 UI */}
      <RoomChat
        user={user}
        message={message}
        roomid={room.roomid}
        handleChangeMessage={handleChangeMessage}
        send={send}
        setLogs={setLogs}
        allmessage={allmessage}
      />
    </div>
  );
};

export default RoomContainer;

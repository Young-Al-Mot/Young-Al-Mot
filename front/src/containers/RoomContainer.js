import React, { useState, useEffect } from "react";
import socketio from "socket.io-client";
import { useSelector } from "react-redux";

import RoomChat from "../components/RoomChat";

//서버 주소
const socket = socketio.connect("http://localhost:5000");

const RoomContainer = () => {
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
    socket.emit(room.roomid, {
      name: user.currentNickname,
      message: message,
    });
    setMessage("");
  };

  //마운트 되었을때
  useEffect(() => {
    // 실시간으로 로그를 받게 설정
    //백엔드 완성되면 수정해야됨
    socket.on(room.roomid, (obj) => {
      const logs2 = logs;
      obj.key = "key_" + (logs.length + 1);
      logs2.unshift(obj); // 로그에 추가하기
      setLogs(logs2);
      const tmp = logs.map((e) => (
        <div key={e.key}>
          <span>{e.name}</span>
          <span>: {e.message}</span>
          <p />
        </div>
      ));
      setAllmessage(tmp);
      console.log("chat",tmp);
    });
  }, [logs]);

  console.log(room.roomid);

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

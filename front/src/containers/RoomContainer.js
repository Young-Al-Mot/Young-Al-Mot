import React, { useState, useEffect } from "react";
import socketio from "socket.io-client";

import RoomChat from "../components/RoomChat";

//서버 주소
const socket = socketio.connect("http://192.168.0.16:3001");
const RoomContainer = () => {
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState("");

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const send = (e) => {
    socket.emit("chat-msg", {
      name: this.state.name,
      message: this.state.message,
    });
    setMessage("");
  };

  //마운트 되었을때
  useEffect(() => {
    // 실시간으로 로그를 받게 설정
    socket.on("chat-msg", (obj) => {
      const logs2 = logs;
      obj.key = "key_" + (logs.length + 1);
      console.log(obj);
      logs2.unshift(obj); // 로그에 추가하기
      setLogs({ logs: logs2 });
    });
  }, [logs, setLogs]);

  

  return (
    <div>
      {/* 방 UI */}
      <RoomChat
        message={message}
        logs={logs}
        handleChangeMessage={handleChangeMessage}
        send={send}
      />
    </div>
  );
};

export default RoomContainer;

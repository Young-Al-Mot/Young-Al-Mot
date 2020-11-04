import React from "react";
import socketio from "socket.io-client";

const socket = socketio.connect("http://localhost:5000");

const SocketFunc = () => {
  const socketIn = () => {
    //방에 들어가게되면 소켓으로 방 접속한걸 알림
    socket.emit("join", {
      roomno: roomid,
      name: JSON.parse(sessionStorage.userInfo).nickname,
    });
  };

  const getSocket = () => {
    return socket;
  };
};

export default SocketFunc;

import React from "react";
import socketio from "socket.io-client";

const socket = socketio.connect("http://localhost:5000");

export const socketConnect = () => {
  socket.connect();
};

export const socketIn = (roomid, nickname) => {
  //방에 들어가게되면 소켓으로 방 접속한걸 알림
  socket.emit("join", {
    roomno: roomid,
    name: nickname,
  });
};

export const getSocket = () => {
  return socket;
};

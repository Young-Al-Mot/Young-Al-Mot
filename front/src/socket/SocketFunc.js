import React from "react";
import socketio from "socket.io-client";
import {config} from "../config";

const socket = socketio.connect(config.api);

export const socketConnect = () => {
  socket.connect();
};

export const socketIn = (roomid, nickname,userid) => {
  //방에 들어가게되면 소켓으로 방 접속한걸 알림
  socket.emit("join", {
    roomno: roomid,
    name: nickname,
  });
  socket.emit('socketin',userid);
};

export const getSocket = () => {
  return socket;
};

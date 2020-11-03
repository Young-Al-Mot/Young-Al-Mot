import React from 'react';
import socketio from "socket.io-client";

const socket = socketio.connect("http://localhost:5000");

const getSoket = () => {
    return socket;
};

export default getSoket;
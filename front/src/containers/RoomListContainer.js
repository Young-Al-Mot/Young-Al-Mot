import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

import RoomList from "../components/RoomList";
import { roomInRequest } from "../modules/room";
import RoomContainer from "./RoomContainer";

const RoomListContainer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [roomInfo, setRoomInfo] = useState([]);
  const [isRoomCreate, setIsRoomCreate] = useState(false);

  const handleChangeIsRoomCreate = (e) => {
    setIsRoomCreate(true);
  };
  const handleChangeIsRoomCreateFalse = (e) => {
    setIsRoomCreate(false);
  };

  //방정보 받아오는거
  const getInfo = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/roomlist",
      data: {},
    }).then((res) => {
      return setRoomInfo(res.data.list);
    });
  };

  const ClickRoom = (val) => {
    //리듀서에 유저 현재 방정보 업데이트
    console.log("clickroom", val);
    dispatch(roomInRequest(val)).then(() => {
      //방으로 넘어갈때 방 id넘겨줌
      history.push("/room");
    })
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <RoomList
      getInfo={getInfo}
      roomInfo={roomInfo}
      isRoomCreate={isRoomCreate}
      handleChangeIsRoomCreate={handleChangeIsRoomCreate}
      handleChangeIsRoomCreateFalse={handleChangeIsRoomCreateFalse}
      ClickRoom={ClickRoom}
    />
  );
};

export default RoomListContainer;

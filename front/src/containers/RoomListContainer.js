import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import RoomList from "../components/RoomList";

const RoomListContainer = () => {
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

  useEffect(()=>{
    getInfo();
  },[]);

  return (
    <RoomList
      getInfo={getInfo}
      roomInfo={roomInfo}
      isRoomCreate={isRoomCreate}
      handleChangeIsRoomCreate={handleChangeIsRoomCreate}
      handleChangeIsRoomCreateFalse={handleChangeIsRoomCreateFalse}
    />
  );
};

export default RoomListContainer;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import RoomList from "../components/RoomList";

const RoomListContainer = () => {
  const dispatch = useDispatch();
  const [roomNum, setRoomNum] = useState(-1);
  const userId = useSelector((state) => state.auth.status.currentUser);

  const handleChangeRoomNum = (e) => {
    setRoomNum(e.target.value);
  };

  //서버에 방정보 보내는거
  const sendInfo = () => {
    axios({
      method: "POST",
      url: "",
      data: {
        userid: userId,
        roomnum: roomNum,
      },
    });
  };

  //방정보 받아오는거
  const getInfo = () => {
    axios({
      method: "GET",
      url: "",
    });
  };

  
  return <RoomList></RoomList>;
};

export default RoomListContainer;

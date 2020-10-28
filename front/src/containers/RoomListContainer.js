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
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [roomid, setroomid] = useState(0);
  const [password, setpassword] = useState("");
  

  const handleChangeIsRoomCreate = () => {
    setIsRoomCreate(true);
  };
  const handleChangeIsRoomCreateFalse = () => {
    setIsRoomCreate(false);
  };

  const handleChangeIsPasswordConfirm = () => {
    setIsPasswordConfirm(true);
  };
  const handleChangeIsPasswordConfirmFalse = () => {
    setIsPasswordConfirm(false);
  };
  const handleChangeRoomId = (val) => {
    setroomid(val);
  };
  const handleChangePassword = (e) => {
    setpassword(e.target.value);
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
    if (val == null) {
      console.log("clickroom", roomid);
      console.log(password);
      dispatch(roomInRequest(roomid, password)).then((res) => {
        //리듀서에 방정보 넣어둿으니 여기선 그냥 넘겨만줌
        if (res.roomid != 0) history.push("/room");
      });
    }else{
      console.log("clickroom", val);
      dispatch(roomInRequest(val, password)).then((res) => {
        //리듀서에 방정보 넣어둿으니 여기선 그냥 넘겨만줌
        if (res.roomid != 0) history.push("/room");
      });
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <RoomList
      roomInfo={roomInfo}
      isRoomCreate={isRoomCreate}
      isPasswordConfirm={isPasswordConfirm}
      getInfo={getInfo}
      handleChangeIsRoomCreate={handleChangeIsRoomCreate}
      handleChangeIsRoomCreateFalse={handleChangeIsRoomCreateFalse}
      handleChangeIsPasswordConfirm={handleChangeIsPasswordConfirm}
      handleChangeIsPasswordConfirmFalse={handleChangeIsPasswordConfirmFalse}
      handleChangeRoomId={handleChangeRoomId}
      handleChangePassword={handleChangePassword}
      ClickRoom={ClickRoom}
    />
  );
};

export default RoomListContainer;

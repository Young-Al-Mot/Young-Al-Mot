import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

import RoomList from "../components/RoomList";
import { roomInRequest, roomOutRequest } from "../modules/room";
import {socketIn,getSocket} from "../socket/SocketFunc";
import {config} from '../config';

const RoomListContainer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [roomInfo, setRoomInfo] = useState([]);
  const [isRoomCreate, setIsRoomCreate] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [roomid, setroomid] = useState(0);
  const [password, setpassword] = useState("");
  const user = useSelector((state) => state.auth.status);


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

  const socket=getSocket();

  //방정보 받아오는거
  const getInfo = () => {
    axios({
      method: "POST",
      url: `${config.api}/roomlist`,
      data: {},
    }).then((res) => {
      console.log(res.data.list);
      return setRoomInfo(res.data.list);
    });
  };

  const ClickRoom = (val) => {
    //리듀서에 유저 현재 방정보 업데이트
    if (val == null) {
      console.log("clickroom", roomid);
      console.log(password);
      //비번 있는방
      dispatch(roomInRequest(roomid, password)).then((res) => {
        //리듀서에 방정보 넣어둿으니 여기선 그냥 넘겨만줌
        if (res.error == 4) {
          alert("방이 가득찼습니다");
          getInfo();
        } else if (res.error == 5) {
          alert("비밀번호가 틀렸습니다");
        } else if(res.error==6){
          alert("이미 게임중인 아이디입니다");
        }
        else if (res.roomid != 0) {
          socketIn(roomid,user.currentNickname);
          history.push("/room");
        }
      });
    } else {
      //비번 없는방
      console.log("clickroom", val);
      dispatch(roomInRequest(val, password)).then((res) => {
        //리듀서에 방정보 넣어둿으니 여기선 그냥 넘겨만줌
        if (res.error == 4) {
          alert("방이 가득찼습니다");
          getInfo();
        } else if (res.roomid != 0) {
          socketIn(val,user.currentNickname);
          history.push("/room");
        }
      });
    }
  };

  useEffect(() => {
    //방리스트로 나오면 방 나간거 처리해줌
    dispatch(roomOutRequest(user.currentUser));
    socket.disconnect();
    console.log("roomlist mount");
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

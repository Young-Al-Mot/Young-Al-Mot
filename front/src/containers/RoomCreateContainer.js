import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import RoomCreate from "../components/RoomCreate";
import RoomContainer from "./RoomContainer";
import { roomCreateRequest, roomInRequest } from "../modules/room";
import {socketIn} from "../socket/SocketFunc";

const RoomCreateContainer = () => {
  // 방제목 비밀번호 게임 인원수
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [gametype, setGametype] = useState("A Stands For");
  const [round, setround] = useState(1);
  const [peopleMaxNum, setPeopleMaxNum] = useState(2);
  const user = useSelector(state => state.auth.status)
  const dispatch = useDispatch();
  const history = useHistory();


  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleChangeGametype = (e) => {
    setGametype(e.target.value);
  };
  const handelChangeRound=(e)=>{
    setround(e.target.value);
  }
  const handleChangePeopleMaxNum = (e) => {
    setPeopleMaxNum(e.target.value);
  };

  const handleCreateroom = (e) => {
    console.log("a");
    dispatch(roomCreateRequest(
      title,
      password,
      gametype,
      peopleMaxNum,
      round
    )).then((res) => {
        //방만들기 성공하면 방안으로 입장
        socketIn(res.roomid,user.currentNickname);
        history.push("/room");
    });
  };

  useEffect(() => {
    if(gametype=='끝말잇기'){
      setround(5);
    }
  }, [gametype])

  return (
    <RoomCreate
      title={title}
      password={password}
      gametype={gametype}
      round={round}
      peopleMaxNum={peopleMaxNum}
      handleChangeTitle={handleChangeTitle}
      handleChangePassword={handleChangePassword}
      handleChangeGametype={handleChangeGametype}
      handelChangeRound={handelChangeRound}
      handleChangePeopleNum={handleChangePeopleMaxNum}
      handleCreateroom={handleCreateroom}
    ></RoomCreate>
  );
};

export default RoomCreateContainer;

import React from "react";
import { useState } from "react";
import styled from "styled-components";
import RoomCreateContainer from "../containers/RoomCreateContainer";
import modenine from "./MODENINE.TTF";
import Refresh from "./refresh.png";
import Lock from "./lock.png";
import kotra from './KOTRA_BOLD.ttf';

const AllContent = styled.div`
  @font-face {
    font-family: kotra;
    src: local("kotra"), url(${kotra});
  }
  font-family: kotra;
  margin-left: 25%;
  margin-right: 25%;
`;

const RoomContent = styled.div`
  position: relative;
  margin-top: 30px;
`;

const RoomCreateContent = styled.div`
  position: absolute;
  top: 200px;
  margin-left: 10%;
  padding: 20px;
  width: 30%;
  border-radius: 30px;
  background-color: #97cfcb;
  border : 1px solid black;
`;

const TopContent = styled.div`
  margin: 5px 0px 5px;
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
`;

const FuncBotton = styled.div`
  margin-top: 20px;
  font-size: 18px;
`;

const TopRoomList = styled.div`
  margin-bottom: 20px;
  text-align: center;
  color: white;
  font-size: 200%;
  border-radius: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #565273;
  box-shadow: 3px 3px 3px gray;
`;

const MiddleContent = styled.div`
  background-color: #565273;
  padding-bottom: 2%;
  box-shadow: 3px 3px 3px gray;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const BodyContent = styled.div`
  display: flex;
  margin-top: 2%;
  border-radius: 50px;
  background-color: white;
  height: 40px;
  width: 80%;
  margin-left: 10%;
  align-items: center;
`;

const RoomNo = styled.span`
  display: flex;
  justify-content: center;
  flex: 1;
`;

const RoomName = styled.span`
  display: flex;
  justify-content: center;
  flex: 3;
  font-size: 120%;
`;

const GameName = styled.span`
  display: flex;
  justify-content: center;
  flex: 2;
`;

const Player = styled.span`
  display: flex;
  justify-content: center;
  flex: 1;
`;

const Password = styled.div`
  position: absolute;
  top: 80px;
  margin-left: 25%;
  padding-left: 1%;
  padding-top: 0.9%;
  height: 30px;
  width: 40%;
  background-color: #b3b3b3;
  border: solid thin;
`;

const RoomList = ({
  roomInfo,
  getInfo,
  isRoomCreate,
  isPasswordConfirm,
  handleChangeIsRoomCreate,
  handleChangeIsRoomCreateFalse,
  handleChangeIsPasswordConfirm,
  handleChangeIsPasswordConfirmFalse,
  handleChangeRoomId,
  handleChangePassword,
  ClickRoom,
}) => {
  const roomCreate = (
    <RoomCreateContent>
      <RoomCreateContainer />
      <br />
      <button onClick={handleChangeIsRoomCreateFalse}>나가기</button>
    </RoomCreateContent>
  );

  const confirmPassword = (
    <Password>
      <input type="password" onChange={handleChangePassword} />
      &nbsp;&nbsp;
      <button onClick={() => ClickRoom()}>확인</button>&nbsp;&nbsp;
      <button onClick={handleChangeIsPasswordConfirmFalse}>나가기</button>
    </Password>
  );

  const roomInfoList = roomInfo.map(val => (
    <BodyContent
      key={val.room_no}
      onClick={() => {
        if (val.password == null) {
          ClickRoom(val.room_no);
          handleChangeIsPasswordConfirmFalse();
        } else {
          if (isPasswordConfirm == true) handleChangeIsPasswordConfirmFalse();
          else {
            handleChangeRoomId(val.room_no);
            handleChangeIsPasswordConfirm();
          }
        }
      }}
    >
      {val.password == null ? (
        <RoomNo>{val.room_no}</RoomNo>
      ) : (
        <RoomNo>
          <img src={Lock} />
          &nbsp;{val.room_no}
        </RoomNo>
      )}
      <RoomName>{val.room_name}</RoomName>
      <GameName>{val.game_name}</GameName>
      <Player>
        {val.nowplayer}/{val.maxplayer}
      </Player>
    </BodyContent>
  ));

  return (
    <AllContent>
      <RoomContent>
        <TopRoomList>방목록</TopRoomList>
        <TopContent>
          <Title></Title>

          <FuncBotton>
            <a onClick={handleChangeIsRoomCreate}>방만들기&nbsp;&nbsp;</a>
            <a onClick={getInfo}>
              <img src={Refresh} />
            </a>
          </FuncBotton>
        </TopContent>
        <MiddleContent>
          <Header>
            {/* <RoomNo></RoomNo>
            <RoomName></RoomName>
            <GameName></GameName>
            <Player></Player> */}
          </Header>
          {roomInfoList}
          {isPasswordConfirm ? confirmPassword : true}
        </MiddleContent>
      </RoomContent>

      {/* 방만들기 */}
      {isRoomCreate ? roomCreate : true}
    </AllContent>
  );
};

export default RoomList;

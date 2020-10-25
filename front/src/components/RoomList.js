import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import RoomCreateContainer from "../containers/RoomCreateContainer";

const AllContent = styled.div`
  margin-left: 20%;
  margin-right: 20%;
`;

const RoomContent = styled.div`
  position: relative;
  margin-top: 30px;
`;

const RoomCreateContent = styled.div`
  position: absolute;
  top: 150px;
  width: 60%;
  background-color: gray;
  border: solid thin;
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
  margin-top: 30px;
  font-size: 18px;
`;

const MiddleContent = styled.div`
  border: solid thin;
`;

const Header = styled.div`
  border-bottom: solid;
`;

const BodyContent = styled.div`
  border-top: solid thin;
`;

const RoomList = ({ roomInfo, getInfo }) => {
  const [isRoomCreate, setIsRoomCreate] = useState(false);

  const handleChangeIsRoomCreate = (e) => {
    setIsRoomCreate(true);
  };
  const handleChangeIsRoomCreateFalse = (e) => {
    setIsRoomCreate(false);
  };

  console.log("방정보");
  console.log(roomInfo);

  const roomInfoList = roomInfo.map((val) => (
    <BodyContent>
      <span>{val.room_no}</span> ,<span>{val.room_name}</span> ,
      <span>{val.game_name}</span> ,<span>{val.nowplayer}</span> ,
      <span>{val.maxplayer}</span>
    </BodyContent>
  ));

  return (
    <AllContent>
      <RoomContent>
        <TopContent>
          <Title>일반전</Title>
          <FuncBotton>
            <a onClick={handleChangeIsRoomCreate}>방만들기</a>
            <a onClick={getInfo}>새로고침</a>
          </FuncBotton>
        </TopContent>
        <MiddleContent>
          <Header>방번호 제목 게임 인원 입장</Header>
          {roomInfoList}
          {/* BodyContent를 서버에서 방 정보를 받아와서 갯수만큼 반복시켜야됨 */}
        </MiddleContent>
      </RoomContent>

      {/* 방만들기 */}
      {isRoomCreate ? (
        <RoomCreateContent>
          <RoomCreateContainer />
          <br />
          <a onClick={handleChangeIsRoomCreateFalse}>나가기</a>
        </RoomCreateContent>
      ) : (
        //아무의미없음
        true
      )}
    </AllContent>
  );
};

export default RoomList;

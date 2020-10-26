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
  display: flex;
  border-bottom: solid;
`;

const BodyContent = styled.div`
  display: flex;
  border-top: solid thin;
`;

const RoomNo = styled.span`
  display: flex;
  justify-content: center;
  border-right: solid thin;
  flex: 1;
`;

const RoomName = styled.span`
  display: flex;
  justify-content: center;
  border-right: solid thin;
  flex: 3;
`;

const GameName = styled.span`
  display: flex;
  justify-content: center;
  border-right: solid thin;
  flex: 2;
`;

const Player = styled.span`
  display: flex;
  justify-content: center;
  flex: 1;
`;

const RoomList = ({
  roomInfo,
  getInfo,
  isRoomCreate,
  handleChangeIsRoomCreate,
  handleChangeIsRoomCreateFalse,
}) => {
  console.log("방정보");
  console.log(roomInfo);

  const roomInfoList = roomInfo.map((val) => (
    <BodyContent key={val.room_no}>
      <RoomNo>{val.room_no}</RoomNo> <RoomName>{val.room_name}</RoomName>
      <GameName>{val.game_name}</GameName>{" "}
      <Player>
        {val.nowplayer}/{val.maxplayer}
      </Player>
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
          <Header>
            <RoomNo>방번호</RoomNo>
            <RoomName>제목</RoomName>
            <GameName>게임</GameName>
            <Player>인원</Player>
          </Header>
          {roomInfoList}
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

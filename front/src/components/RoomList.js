import React from "react";
import styled, { css } from "styled-components";

const AllContent = styled.div`
  margin-left: 20%;
  margin-right: 20%;
`;

const RoomContent = styled.div`
  margin-top: 30px;
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
  border-bottom:solid;
`;

const BodyContent = styled.div`
  border-top:solid thin;
`;

const RoomList = () => {
  return (
    <AllContent>
      <RoomContent>
        <TopContent>
          <Title>일반전</Title>
          <FuncBotton>
            {/* 아직 기능추가안함 */}
            방만들기 새로고침
          </FuncBotton>
        </TopContent>
        <MiddleContent>
          <Header>방번호 제목 게임 인원 입장</Header>
          <BodyContent>방목록</BodyContent>
          {/* BodyContent를 서버에서 방 정보를 받아와서 갯수만큼 반복시켜야됨 */}
        </MiddleContent>
      </RoomContent>
    </AllContent>
  );
};

export default RoomList;

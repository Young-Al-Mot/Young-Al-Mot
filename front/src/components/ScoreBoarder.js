import React from "react";
import styled from "styled-components";

const ScoreBoardContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 150px;
  width: 60%;
  background-color: #fffff0;
  border: solid thin;
`;

const ScoreBoarder = ({ setisStart, roomUser, setroomUser }) => {
  const clickScoreBoard = () => {
    setisStart(0); //대기방으로 바꿈

    //유저 점수 없앰
    let tmp = roomUser;
    let i = 0;
    for (i = 0; i < tmp.length; i++) {
      tmp[i].score = 0;
    }
    setroomUser(tmp);
  };

  const scoreBoard = roomUser.map((val) => {
    return (
      <div key={val.key}>
        {val.key + 1}등 {val.user}:{val.score}
      </div>
    );
  });

  return (
    <ScoreBoardContent>
      {scoreBoard}
      <div onClick={clickScoreBoard}>확인</div>
    </ScoreBoardContent>
  );
};

export default ScoreBoarder;

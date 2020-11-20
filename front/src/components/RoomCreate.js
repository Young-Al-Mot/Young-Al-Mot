import React from "react";

const RoomCreate = ({
  title,
  password,
  gametype,
  round,
  peopleMaxNum,
  handleChangeTitle,
  handleChangePassword,
  handleChangeGametype,
  handelChangeRound,
  handleChangePeopleNum,
  handleCreateroom,
}) => {
  const gameOptin = () => {
    if (gametype == "A Stands For") {
      return (
        <div>
          {"라운드 : "}
          <select onChange={handelChangeRound}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <br />
        </div>
      );
    } else if (gametype == "끝말잇기") {
      return (
        <div>
          {"라운드 : "}
          <select onChange={handelChangeRound}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">2</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
          <br />
        </div>
      );
    } else {
      //행맨
      return (
        <div>
          {"라운드 : "}
          <select onChange={handelChangeRound}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          <br />
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        방 제목 :{" "}
        <input onChange={handleChangeTitle} value={title} type="text" />
      </div>
      <div>
        비밀번호 : <input onChange={handleChangePassword} type="password" />
      </div>
      <div>
        게임 :{" "}
        <select onChange={handleChangeGametype}>
          <option value="A Stands For">A Stands For</option>
          <option value="끝말잇기">끝말잇기</option>
          <option value="행맨">행맨</option>
        </select>
      </div>
      {gameOptin()}
      <div>
        인원수 :{" "}
        <select onChange={handleChangePeopleNum}>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <p></p>
      <button onClick={handleCreateroom}>방생성</button>
    </div>
  );
};

export default RoomCreate;

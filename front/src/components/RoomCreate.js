import React from "react";

const RoomCreate = ({
  title,
  password,
  gametype,
  peopleMaxNum,
  handleChangeTitle,
  handleChangePassword,
  handleChangeGametype,
  handleChangePeopleNum,
  handleCreateroom,
}) => {
  return (
    <div>
      방 제목: <input onChange={handleChangeTitle} value={title} type="text" />
      비밀번호: <input onChange={handleChangePassword} type="password" />
      <br />
      게임:
      <select onChange={handleChangeGametype}>
        <option value="A stands for">A stands for</option>
        <option value="끝말잇기">끝말잇기</option>
        <option value="행맨">행맨</option>
      </select>
      <br />
      인원수:
      <select onChange={handleChangePeopleNum}>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <br />
      <button onClick={handleCreateroom}>방생성</button>
    </div>
  );
};

export default RoomCreate;

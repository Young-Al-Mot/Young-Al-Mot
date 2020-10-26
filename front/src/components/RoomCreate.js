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
        <option value="십자말풀이">십자말풀이</option>
        <option value="끝말잇기">끝말잇기</option>
        <option value="A stands for">A stands for</option>
      </select>
      <br />
      인원수:
      <select onChange={handleChangePeopleNum}>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <br />
      <a onClick={handleCreateroom}>방생성</a>
    </div>
  );
};

export default RoomCreate;

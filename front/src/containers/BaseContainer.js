import React, { useEffect } from "react";
import { userInfoRequest } from "../modules/auth";
import { useDispatch } from "react-redux";

const BaseContainer = () => {
  const dispatch = useDispatch();

  const checkUser = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      //원래는 인자로 토큰만 넣으면되는데 테스트용으로 이름이랑 닉네임 넣어줌
      dispatch(
        userInfoRequest(userInfo.username, userInfo.nickname, userInfo.token)
      );
    }
  };

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return <div></div>;
};

export default BaseContainer;

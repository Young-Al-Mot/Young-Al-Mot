import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import { loginRequest } from "../modules/auth";

const LoginContainer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const login = useSelector((state) => state.auth.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    let val = validateForm(username, password);
    if (val) {
      dispatch(loginRequest(username, password)).then((res) => {
        //로그인 성공이면 홈으로 보냄
        if (res.username) {
          history.push("/");
        } else alert("아이디, 비밀번호를 확인해 주세요");
      });
    } else {
      alert("아이디, 비말번호를 입력해주세요");
    }
  };

  const validateForm = (username, password) => {
    return username && username.length > 0 && password && password.length > 0;
  };

  return (
    <LoginForm
      username={username}
      password={password}
      handleChangeUsername={handleChangeUsername}
      handleChangePassword={handleChangePassword}
      handleSubmit={handleSubmit}
      validate={validateForm}
    />
  );
};

export default LoginContainer;

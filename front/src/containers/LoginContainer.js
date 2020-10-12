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

  const handleChangeUsername = useCallback(
    (e) => {
      setUsername(e.target.value);
    },
    [setUsername]
  );

  const handleChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
    },
    [setPassword]
  );

  const handleSubmit = useCallback(
    (e) => {
      let val = validateForm(username, password);
      if (val) {
        dispatch(loginRequest(username, password)).then((res) => {
          //백엔드 들어오는거 보고 수정해야됨

          //로그인 성공이면 홈으로 보냄
          history.push("/");
          //근데 성공하면 인증정보 저장안해도되나?
          //참고한 블로그에선 
          //   let loginData = {
          //     isLoggedIn: true,
          //     username: username,
          //   };
          //   document.cookie = "key=" + btoa(JSON.stringify(loginData));
          //이런거 하던데

          //실패할경우
          alert("아이디, 비밀번호를 확인해 주세요");
        });

      } else {
        alert("아이디, 비말번호를 입력해주세요");
      }
    },
    [dispatch, history, username, password, status]
  );

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

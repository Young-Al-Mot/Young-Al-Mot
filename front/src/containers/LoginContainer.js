import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoginForm from "../components/LoginForm";
import {loginRequest} from "../modules/auth";

const LoginContainer = () => {
  const dispatch = useDispatch();
  const { login, status } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeUsername = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const handleChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    dispatch(loginRequest(username,password));
  },[dispatch,username,password]);

  const validateForm = (username,password)=>{
    return (username && username.length > 0) && (password && password.length > 0);

  };

  return (
    <LoginForm
      username={username}
      password={password}
      handleChangeUsername={handleChangeUsername}
      handleChangePassword={handleChangePassword}
      handleSubmit = {handleSubmit}
      validate={validateForm}
    />
  );
};

export default LoginContainer;

import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import RegisterForm from "../components/RegisterForm";
import { registerRequest } from "../modules/auth";

const RegisterContainer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  //패스워드 같은지
  const [isSame, setIsSame] = useState(false);
  const [isSameMessage, setIsSameMessage] = useState("");
  
  const [isValid, setIsValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChangeUsername = useCallback(
    (e) => {
      setUsername(e.target.value);
    },
    [setUsername]
  );

  //영문자 혼합 8이상 20이하 검사
  const isMixedPassword = (str) =>{
    let ret1=/^[a-zA-Z0-9]{8,20}$/.test(str)
    let ret2=/[a-zA-Z]/g.test(str)
    let ret3=/[0-9]/g.test(str)
    
    return ret1&&ret2&&ret3;
  }

  const handleChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      //숫자 글자 섞였는지 확인도 추가
      if (!isMixedPassword(e.target.value)) {
        setPasswordError("비밀번호는 영문자 혼합 8자리 이상으로 작성해주세요");
        setIsValid(false);
      }else {
        setPasswordError("")
        setIsValid(true);
      }
    },
    [setPassword, setPasswordError, setIsValid]
  );

  const handleChangeNickname = useCallback(
    (e) => {
      setNickname(e.target.value);
    },
    [setNickname]
  );

  const handleChangeEmail = useCallback(
    (e) => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  const handleSubmit = useCallback(
    (e) => {
      //e.preventDefault();
      if (!isValid) {
        alert("비밀번호는 문자와 숫자를 혼합하여 8글자이상으로 작성해 주세요");
      } else if (!isSame) {
        alert("비밀번호가 다릅니다");
      } else {
        dispatch(registerRequest(username, password, nickname, email)).then((res)=>{
            //백엔드에서 어떻게 넘어오는지 보고 수정해
            console.log(res);
            //성공이면 
            history.push("/login");

            //실패이면
            //response 값에서 error가져와서 출력해줘야됨
        });
      }
    },
    [dispatch, isValid, isSame, username, password, nickname, email]
  );

  const passwordConfirm = useCallback(
    (e) => {
      if (e.target.value == password) {
        setIsSame(true);
        setIsSameMessage("");
      }else{
        setIsSame(false);
        setIsSameMessage("비밀번호가 다릅니다");
      }
    },
    [password, setIsSame,setIsSameMessage]
  );

  return (
    <RegisterForm
      username={username}
      password={password}
      nickname={nickname}
      email={email}
      passwordError={passwordError}
      isSame={isSame}
      passwordIsSame={isSameMessage}
      handleChangeUsername={handleChangeUsername}
      handleChangePassword={handleChangePassword}
      handleChangeNickname={handleChangeNickname}
      handleChangeEmail={handleChangeEmail}
      handleSubmit={handleSubmit}
      passwordConfirm={passwordConfirm}
    />
  );
};

export default RegisterContainer;

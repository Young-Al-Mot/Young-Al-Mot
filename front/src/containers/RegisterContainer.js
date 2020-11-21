import { em } from "polished";
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


  //패스워드 같은지
  const [isSame, setIsSame] = useState(false);
  const [isSameMessage, setIsSameMessage] = useState("");

  const [isValidPassword, setIsValidPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");



  const handleChangeUsername = useCallback(
    (e) => {
      setUsername(e.target.value);
    },
    [setUsername]
  );

  //영문자 혼합 8이상 20이하 검사
  const isMixedPassword = (str) => {
    let ret1 = /^[a-zA-Z0-9!@#$%^~*+=-]{8,20}$/.test(str);
    let ret2 = /[a-zA-Z]/g.test(str);
    let ret3 = /[0-9]/g.test(str);

    return ret1 && ret2 && ret3;
  };

  const handleChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      //숫자 글자 섞였는지 확인도 추가
      if (!isMixedPassword(e.target.value)) {
        setPasswordError("비밀번호는 영문자 혼합 8자리 이상으로 작성해주세요");
        setIsValidPassword(false);
      } else {
        setPasswordError("");
        setIsValidPassword(true);
      }
    },
    [setPassword, setPasswordError, setIsValidPassword]
  );

  const handleChangeNickname = useCallback(
    (e) => {
      setNickname(e.target.value);
    },
    [setNickname]
  );

  const handleSubmit = useCallback(
    (e) => {
      //e.preventDefault();     
      if(username.length==0){
        alert("아이디를 입력해주세요");
      }else if(username.length!= username.replace(/ /g,"").length){
        alert("아이디에 공백을 사용할수 없습니다")
      }else if (!isValidPassword) {
        alert("비밀번호는 문자와 숫자를 혼합하여 8글자이상으로 작성해 주세요");
      } else if (!isSame) {
        alert("비밀번호가 다릅니다");
      }else if(nickname.length==0){
        alert("닉네임을 입력해주세요")
      }else if(nickname.length!= nickname.replace(/ /g,"").length){
        alert("닉네임에 공백을 사용할수 없습니다")
      }else {
        dispatch(registerRequest(username, password, nickname)).then(
          (res) => {
            //백엔드에서 어떻게 넘어오는지 보고 수정해
            if (res.type == "AUTH_REGISTER_SUCCESS") history.push("/login");
            else{
              if(res.error==0)
                alert("이미 존재하는 아이디입니다");
              else if(res.error==1)
                alert("이미 존재하는 닉네임입니다");
              else if(res.error==2)
                alert("이미 존재하는 이메일입니다");
            }
          }
        );
      }
    },
    [dispatch, isValidPassword, isSame, username, password, nickname]
  );

  const passwordConfirm = useCallback(
    (e) => {
      if (e.target.value == password) {
        setIsSame(true);
        setIsSameMessage("");
      } else {
        setIsSame(false);
        setIsSameMessage("비밀번호가 다릅니다");
      }
    },
    [password, setIsSame, setIsSameMessage]
  );

  return (
    <RegisterForm
      username={username}
      password={password}
      nickname={nickname}
      passwordError={passwordError}
      passwordIsSame={isSameMessage}
      handleChangeUsername={handleChangeUsername}
      handleChangePassword={handleChangePassword}
      handleChangeNickname={handleChangeNickname}
      handleSubmit={handleSubmit}
      passwordConfirm={passwordConfirm}
    />
  );
};

export default RegisterContainer;

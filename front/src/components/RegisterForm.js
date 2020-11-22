import React from "react";

import styled from "styled-components";
import kotra from './KOTRA_BOLD.ttf';
const RegisterLabel = styled.div`
  @font-face {
    font-family: kotra;
    src: local("kotra"), url(${kotra});
  }
  font-family: kotra;
  display: flex;
  height: 95vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 90px;
`;

const StateLabel = styled.div`
  text-align: left;
  width:50vw;
  max-width: 370px;
  font-size: 18px;
  font-weight: 900;
`;

const RegisterInput = styled.input`
  max-width: 280px;
  max-height: 30px;

  width:45vw;
  height:8vw;
  margin: 4px;
  font-size: 15px;
  border: 2px solid;
`;

const LineLabel = styled.div`
  margin-top: 10px;
  margin-bottom:10px;
  font-size:2vw;
`;

const RegisterButton = styled.a`
  display: flex;
  width: 200px;
  height: 40px;
  margin-top: 30px;
  background-color: gray;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage=styled.div`
  font-size:12px;
  text-align: center;
`

const RegisterForm = ({
  username,
  password,
  nickname,
  passwordError,
  passwordIsSame,
  handleChangeUsername,
  handleChangePassword,
  handleChangeNickname,
  handleSubmit,
  passwordConfirm,
}) => {
  const handleKeyPress = (e) => {
    if (e.charCode == 13) {
      //엔터치면 로그인되게 함
      handleSubmit();
    }
  };

  return (
    <RegisterLabel>
      <FormLabel>
        <StateLabel>회원가입</StateLabel>
        <LineLabel>
          아이디:
          <RegisterInput
            type="text"
            name="username"
            value={username}
            onChange={handleChangeUsername}
          />
        </LineLabel>
        <LineLabel>
          비밀번호:
          <RegisterInput
            type="password"
            value={password}
            onChange={handleChangePassword}
          />
          <ErrorMessage>{passwordError}</ErrorMessage>
        </LineLabel>
        <LineLabel>
          비밀번호 확인:
          <RegisterInput type="password" onChange={passwordConfirm} />
          <ErrorMessage>{passwordIsSame}</ErrorMessage>
        </LineLabel>
        <LineLabel>
          닉네임:
          <RegisterInput
            type="text"
            value={nickname}
            onChange={handleChangeNickname}
          />
        </LineLabel>
      </FormLabel>
      <RegisterButton onClick={handleSubmit}>회원가입 하기</RegisterButton>
    </RegisterLabel>
  );
};

export default RegisterForm;

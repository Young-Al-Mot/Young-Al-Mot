import React from "react";

const LoginForm = ({
  username,
  password,
  handleChangeUsername,
  handleChangePassword,
  handleSubmit,
  validate,
}) => {
  
  const handleKeyPress = (e) =>{
    if(e.charCode==13){//엔터치면 로그인되게 함
      handleSubmit();
    }
  }



  return (
    <div className="Login">
     
        아이디
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChangeUsername}
        />
        <br/>
        비밀번호
        <input
          type="password"
          value={password}
          onChange={handleChangePassword}
          onKeyPress = {handleKeyPress}
        />
        <a onClick={handleSubmit}>
          로그인
        </a>
  
    </div>
  );
};

export default LoginForm;

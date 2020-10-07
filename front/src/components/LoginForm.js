import React from "react";

const LoginForm = ({
  username,
  password,
  handleChangeUsername,
  handleChangePassword,
  handleSubmit,
  validate,
}) => {
  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        아이디
        <input
          type="text"
          name="id"
          value={username}
          onChange={handleChangeUsername}
        />
        <br/>
        비밀번호
        <input
          type="password"
          value={password}
          onChange={handleChangePassword}
        />
        <button disabled={!validate} type="submit">
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

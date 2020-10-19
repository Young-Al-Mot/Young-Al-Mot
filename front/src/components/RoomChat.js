import React from "react";
import { useSelector } from "react-redux";

const RoomChat = (message, logs, handleChangeMessage, send) => {
  const user = useSelector((state) => state.auth.status.currentNickname);
  const messages = logs.map((e) => (
    <div key={e.key} >
      <span>{e.name}</span>
      <span>: {e.message}</span>
      <p style={{ clear: "both" }} />
    </div>
  ));
  return (
    <div>
      <div>
        메시지:
        <br />
        <input value={message} onChange={handleChangeMessage} />
        <br />
        <button onClick={send()}>전송</button>
      </div>

      <div>{messages}</div>
    </div>
  );
};

export default RoomChat;

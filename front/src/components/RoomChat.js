import React from "react";

const RoomChat = ({
  user,
  message,
  handleChangeMessage,
  send,
  allmessage,
}) => {
  return (
    <div>
      <div>
        메시지:
        <br />
        <input value={message} onChange={handleChangeMessage} />
        <br />
        <button onClick={send}>전송</button>
      </div>
      {allmessage}
    </div>
  );
};

export default RoomChat;

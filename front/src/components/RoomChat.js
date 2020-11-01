import React from "react";
import styled from "styled-components";
import { darken, lighten } from 'polished';

const MessageArea = styled.div`
  position: absolute;
  top:90%;
  left:27%;
  width:40%;
  height:6%;
  border: 1px solid black;
  border-radius:5px;
`;

const MessageInput = styled.input`
  position:absolute;
  top:10%;
  left:1%;
  width:90%;
  height:70%;
  font-family:message-box;
  font-size:150%;
`;

const SendButton = styled.button`
  position: absolute;
  left:93%;
  top:10%;
  display: inline-flex;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  height: 80%;
  font-size: 80%;
  background: #555273;
  line-height:270%;
  border-radius:5px;
  &:hover {
    background: ${lighten(0.1, '#555273')};
  }
  &:active {
    background: ${darken(0.1, '#555273')};
  }
`;

const TextContent = styled.div`
  position: absolute;
  left:27%;
  top:63%;
  vertical-align: bottom;
  color: black;
  overflow: auto;
  height: 25%;
  width: 40%;
  border: 1px solid black;
  border-radius:5px;
  font-size:110%;
`;


const RoomChat = ({
  user,
  message,
  roomid,
  handleChangeMessage,
  send,
  allmessage,
}) => {
  const handleKeyPress = (e) => {
    if (e.charCode == 13) {
      //엔터치면 로그인되게 함
      send();
    }
  };
  return (
    <div>
      <MessageArea>
          <MessageInput
            type="text"
            name="message"
            value={message}
            onChange={handleChangeMessage}
            onKeyPress={handleKeyPress}
          />
        <SendButton onClick={send}>전송</SendButton>
      </MessageArea>
      <TextContent>{allmessage}</TextContent>
    </div>
  );
};

export default RoomChat;
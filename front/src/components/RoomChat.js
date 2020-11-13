import React from "react";
import styled from "styled-components";
import { darken, lighten } from 'polished';

const ChatContent=styled.div`
  height:100%;
  width:100%;
  display:flex;
  flex-direction:column;
  justify-content:space-around;
`;

const TextContent = styled.div`
  color: black;
  overflow: auto;
  height: 70%;
  min-height:200px;
  width: 100%;
  min-width: 300px;
  border: 1px solid black;
  border-radius:20px;
  font-size:105%;
  margin-top:15px;
`;

const MessageContent = styled.div`
  display:flex;
  justify-content:space-around;
  align-items:center;
  max-width:100%;
  height:20%;
  border:1px solid black;
  border-radius:20px;
`;

const MessageInput = styled.input`
  width:85%;
  height:60%;
  border:0px;
  font-size:150%;
`;

const SendButton = styled.button`
  display: flex;
  border-radius: 8px;
  justify-content:center;
  align-items:center;
  color: white;
  cursor: pointer;
  height: 70%;
  width:15%;
  max-width: 90px;
  min-width:50px;
  font-size: 100%;
  background: #555273;
  line-height:270%;
  border-radius:20px;
  &:hover {
    background: ${lighten(0.1, '#555273')};
  }
  &:active {
    background: ${darken(0.1, '#555273')};
  }
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
    <ChatContent>
      <TextContent>{allmessage}</TextContent>

      <MessageContent>
          <MessageInput
            type="text"
            name="message"
            value={message}
            onChange={handleChangeMessage}
            onKeyPress={handleKeyPress}
          />
        <SendButton onClick={send}>전송</SendButton>
      </MessageContent>
      
    </ChatContent>
  );
};

export default RoomChat;
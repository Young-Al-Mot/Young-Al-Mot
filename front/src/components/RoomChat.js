import React from "react";
import styled from "styled-components";
import { darken, lighten } from 'polished';
import modenine from './MODENINE.TTF'

const ChatContent=styled.div`
  height:100%;
  width:80%;
  margin-left:10%;
  display:flex;
  flex-direction:column;
  justify-content:space-around;
  margin-bottom:20%;
`;

const TextContent = styled.div`
  color: black;
  overflow: auto;
  height: 100%;
  min-height:200px;
  width: 100%;
  min-width: 300px;
  border-radius:50px 0px 50px 0px;
  background-color: #2f70a8;
  font-size:105%;
  margin-bottom:4%;
`;

const MessageContent = styled.div`
  display:flex;
  justify-content:space-around;
  align-items:center;
  max-width:100%;
  height:100px;
  background-color: #2f70a8;
  border-radius:20px;
  margin-bottom:10%;
`;

const MessageInput = styled.input`
  width:82%;
  height:60%;
  margin-left:3%;
  border:0px;
  font-size:150%;
  background-color:white;
  border-radius:50px;
`;

const SendButton = styled.div`
  @font-face {
    font-family: modenine;
    src: local('modenine'),
    url(${modenine});
  }
  font-family: modenine;
  display: flex;
  justify-content:center;
  align-items:center;
  color: #fdcb85;
  height: 70%;
  width:15%;
  max-width: 90px;
  min-width:50px;
  font-size: 200%;
  line-height:270%;
  padding-right:2%;
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
        <SendButton onClick={send}>Send</SendButton>
      </MessageContent>
      
    </ChatContent>
  );
};

export default RoomChat;
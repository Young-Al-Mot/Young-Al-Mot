import React from "react";
import styled from "styled-components";
import { darken, lighten } from 'polished';
import modenine from './MODENINE.TTF'

const ChatContent=styled.div`
  height:95%;
  width:100%;

  display:flex;
  flex-direction:column;
  justify-content:space-around;
  margin-bottom:5%;
`;

const TextContent = styled.div`
  @font-face {
    font-family: youth;
    font-style: normal;
    font-weight: 400;
    src: url('//cdn.jsdelivr.net/korean-webfonts/1/orgs/othrs/kywa/Youth/Youth.woff2') format('woff2'),
    url('//cdn.jsdelivr.net/korean-webfonts/1/orgs/othrs/kywa/Youth/Youth.woff') format('woff');
  }
  font-family: youth;
  color: black;
  overflow: auto;
  height: 80%;
  /* min-height:200px; */
  width: 100%;
  min-width: 300px;
  border-radius:50px 0px 50px 0px;
  background-color: #565273;
  font-size:105%;
  margin-bottom:4%;
`;

const MessageContent = styled.div`
  display:flex;
  justify-content:space-around;
  align-items:center;
  max-width:100%;
  height:80px;

  background-color: #565273;
  border-radius:20px;
  margin-bottom:10px;
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
  font-size: 2.5vw;
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
            placeholder="이곳에 정답을 입력해 주세요"
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
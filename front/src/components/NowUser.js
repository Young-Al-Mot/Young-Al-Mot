import React from "react";
import styled from "styled-components";

const Content = styled.div`
  display: flex;
  height: 100%;
  border: solid thin;
`;
const Child = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  border: solid thin;
`;


const NowUser = ({ roomUser, order }) => {
  const readystyle = {
    backgroundColor: "#9B98B9",
  };
  const notstyle = {
    backgroundColor: "#ffffff",
  };
  const orderstyle = {
    backgroundColor:"#D5D5D5",
  }

  const userlist = roomUser.map((val) => {
    if (val.ready == 1) {
      return (
        <Child key={val.key} style={readystyle}>
          {val.master?"(방장)":""}{val.user}:{val.score}
        </Child>
      );
    }else if(val.user==order){
      return (
        <Child key={val.key} style={orderstyle}>
          {val.master?"(방장)":""}{val.user}:{val.score}
        </Child>
      );
    } else {
      return (
        <Child key={val.key} style={notstyle}>
          {val.master?"(방장)":""}{val.user}:{val.score}
        </Child>
      );
    }

  });
  return <Content>{userlist}</Content>;
};

export default NowUser;

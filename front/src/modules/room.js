import axios from "axios";
import { useHistory } from "react-router-dom";
import getSoket from "../soket/getSoket";

// 액션타입
const ROOM_IN = "ROOM_IN";
const ROOM_OUT = "ROOM_OUT";
const socket = getSoket();

//초기값
const initialState = {
  room: {
    title: "",
    gametype: "",
    peoplemaxnum: -1,
    roomid: 0,
  },
};

//액션 생성함수
export const roomin = (roomid, title, gametype, peoplemaxnum) => {
  return {
    type: ROOM_IN,
    roomid,
    title,
    gametype,
    peoplemaxnum,
  };
};

export const roomout = () => {
  return {
    type: ROOM_OUT,
  };
};

//thunk (middleware)
export const roomCreateRequest = (title, password, gametype, peoplemaxnum) => (
  dispatch
) => {
  //방 만들면 방번호 서버에서 리턴해줘야됨
  return axios({
    method: "POST",
    url: "http://localhost:5000/roomnumber",
    data: {
      userid: JSON.parse(sessionStorage.userInfo).username,
      title,
      password,
      gametype,
      peoplemaxnum,
    },
  }).then((res) => {
    return dispatch(roomin(res.data.roomnum, title, gametype, peoplemaxnum));
  });
};

export const roomInRequest = (roomid, password) => (dispatch) => {
  return axios({
    method: "POST",
    url: "http://localhost:5000/roominchk",
    data: {
      userid: JSON.parse(sessionStorage.userInfo).username,
      roomid,
      password,
    },
  })
    .then((res) => {
      if (res.data.success) {
        const roominfo = res.data.roominfo;

        socket.emit("join", {
          roomno: roomid,
          name: JSON.parse(sessionStorage.userInfo).nickname,
        });
        return dispatch(
          roomin(
            roomid,
            roominfo.room_name,
            roominfo.game_name,
            roominfo.maxplayer
          )
        );
      }
    })
    .catch((e) => {
      //e.response.data
      if (e.response.data.error == 4) {
        return { roomid: 0, error: 4 };
      } else if (e.response.data.error == 5) {
        return { roomid: 0, error: 5 };
      }
      return { roomid: 0 };
    });
};

export const roomOutRequest = (userid) => (dispatch) => {
  return axios({
    method: "POST",
    url: "http://localhost:5000/roomout",
    data: {
      userid: userid,
    },
  }).then((res) => {
    if (res.data.success) return dispatch(roomout());
  });
};

//리듀서
const room = (state = initialState, action) => {
  switch (action.type) {
    case ROOM_IN:
      return {
        ...state,
        room: {
          title: action.title,
          gametype: action.gametype,
          peoplemaxnum: action.peoplemaxnum,
          roomid: action.roomid,
        },
      };
    case ROOM_OUT:
      return {
        ...state,
        room: {
          title: "",
          gametype: "",
          peoplemaxnum: -1,
          roomid: 0,
        },
      };
    default:
      return state;
  }
};

export default room;

import axios from "axios";
import { useHistory } from "react-router-dom";
import socketio from "socket.io-client";
// 액션타입
const ROOM_IN = "ROOM_IN";
const ROOM_OUT = "ROOM_OUT";
const socket = socketio.connect("http://localhost:5000");

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
export const roomin = (roomid) => {
  return {
    type: ROOM_IN,
    roomid,
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
    return dispatch(roomin(res.data.roomnum));
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
        socket.emit('join', {
          roomno: roomid,
          name: JSON.parse(sessionStorage.userInfo).username
        });
        return dispatch(roomin(roomid));
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

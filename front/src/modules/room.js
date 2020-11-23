import axios from "axios";
import { socketConnect,getSocket } from "../socket/SocketFunc";
import { config } from "../config";

const socket=getSocket();

// 액션타입
const ROOM_IN = "ROOM_IN";
const ROOM_OUT = "ROOM_OUT";

//초기값
const initialState = {
  room: {
    title: "",
    gametype: "",
    peoplemaxnum: -1,
    roomid: 0,
    maxround: -1,
    count: 7,
  },
};

//액션 생성함수
export const roomin = (
  roomid,
  title,
  gametype,
  peoplemaxnum,
  maxround,
  count
) => {
  return {
    type: ROOM_IN,
    roomid,
    title,
    gametype,
    peoplemaxnum,
    maxround,
    count,
  };
};

export const roomout = () => {
  return {
    type: ROOM_OUT,
  };
};

//thunk (middleware)
export const roomCreateRequest = (
  title,
  password,
  gametype,
  peoplemaxnum,
  maxround,
  count
) => (dispatch) => {
  socketConnect();
  socket.emit("socketin", JSON.parse(sessionStorage.userInfo).username);

  //방 만들면 방번호 서버에서 리턴해줘야됨
  return axios({
    method: "POST",
    url: `${config.api}/roomnumber`,
    data: {
      userid: JSON.parse(sessionStorage.userInfo).username,
      title,
      password,
      gametype,
      peoplemaxnum,
      maxround,
      count,
    },
  })
    .then((res) => {
      return dispatch(
        roomin(res.data.roomnum, title, gametype, peoplemaxnum, maxround, count)
      );
    })
    .catch((e) => {
      socket.disconnect();
      //이미 게임중인 아이디일경우
      if (e.response.data.error == 6) {
        return { roomid: 0, error: 6 };
      }
    });
};

export const roomInRequest = (roomid, password) => (dispatch) => {
  socketConnect();
  socket.emit("socketin", JSON.parse(sessionStorage.userInfo).username);
  return axios({
    method: "POST",
    url: `${config.api}/roominchk`,
    data: {
      userid: JSON.parse(sessionStorage.userInfo).username,
      roomid,
      password,
    },
  })
    .then((res) => {
      if (res.data.success) {
        const roominfo = res.data.roominfo;
        return dispatch(
          roomin(
            roomid,
            roominfo.room_name,
            roominfo.game_name,
            roominfo.maxplayer,
            roominfo.round,
            res.data.count
          )
        );
      }
    })
    .catch((e) => {
      socket.disconnect();
      //e.response.data
      if (e.response.data.error == 4) {
        return { roomid: 0, error: 4 };
      } else if (e.response.data.error == 5) {
        return { roomid: 0, error: 5 };
      } else if (e.response.data.error == 6) {
        //이미 게임중인 아이디일경우
        return { roomid: 0, error: 6 };
      }
      return { roomid: 0 };
    });
};

export const roomOutRequest = (userid) => (dispatch) => {
  // return axios({
  //   method: "POST",
  //   url: `${config.api}/roomout`,
  //   data: {
  //     userid: userid,
  //   },
  // }).then((res) => {
  //   if (res.data.success) return dispatch(roomout());
  // });
  return dispatch(roomout());
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
          maxround: action.maxround,
          count:action.count,
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
          maxround: -1,
          count:0,
        },
      };
    default:
      return state;
  }
};

export default room;

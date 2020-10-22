// 액션타입
const ROOM_IN = "ROOM_IN";
const ROOM_OUT = "ROOM_OUT";

//초기값
const initialState = {
  room: {
    num: -1,
  },
};

//액션 생성함수
export const roomin = (roomnum) => {
  return {
    type: ROOM_IN,
    roomnum,
  };
};

export const roomout = () => {
  return {
    type: ROOM_OUT,
  };
};


//리듀서
const room = (state = initialState, action) => {
  switch (action.type) {
    case ROOM_IN:
      return {
        ...state,
        room: {
          num: action.roomnum,
        },
      };
    case ROOM_OUT:
      return {
        ...state,
        room: {
          num: -1,
        },
      };
    default:
      return state;
  }
};

export default room;

import axios from "axios";
import {config} from "../config";

//액션 타입 만들기
const AUTH_LOGIN = "AUTH_LOGIN"; //로그인
const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";
const AUTH_LOGOUT = "AUTH_LOGOUT"; //로그아웃
const AUTH_REGISTER = "AUTH_REGISTER"; //회원가입
const AUTH_REGISTER_SUCCESS = "AUTH_REGISTER_SUCCESS";
const AUTH_REGISTER_FAILURE = "AUTH_REGISTER_FAILURE";
const USER_INFO_UPDATE = "USER_INFO_UPDATE";

//초기상태 선언
const initialState = {
  login: {
    status: "INIT",
  },
  register: {
    status: "INIT",
    error: -1,
  },
  status: {
    valid: false,
    isLoggedIn: false,
    currentUser: "",
    currentNickname: "",
  },
};

//thunk (middleware)
export function registerRequest(userid, password, nickname, email) {
  return (dispatch) => {
    // Inform Register API is starting
    dispatch(register());

    return axios
      .post(`${config.api}/user_create`, {
        userid: userid,
        password: password,
        nickname: nickname,
        email: email,
      })
      .then((response) => {
        //성공
        return dispatch(registerSuccess());
      })
      .catch((error) => dispatch(registerFailure(error.response.data.error)));
  };
}

export const loginRequest = (userid, password) => (dispatch) => {
  // Inform Login API is starting
  dispatch(login());

  // API REQUEST
  return axios({
    method: "POST",
    url: `${config.api}/loginchk`,
    data: {
      userid: userid,
      password: password,
    },
  })
    .then((response) => {
      // SUCCEED
      return dispatch(loginSuccess(userid, response.data.nickname, response.data.token));
    })
    .catch((error) => {
      // FAILED
      return dispatch(loginFailure()); //로그인은 에러처리없이 그냥 아이디 또는 비밀번호가 잘못되었습니다 보여주면됨
    });
};

export const logoutRequest = () => (dispatch) => {
  return dispatch(logout());
  //테스트를 위해 일단 서버쪽은 주석처리해둠
  // return axios.post("/logout").then((response) => {
  //   return dispatch(logout());
  // });
};

export const userInfoRequest = (username, nickname, token) => (dispatch) => {
  return dispatch(userInfoUpdate(username,nickname,token));
  //테스트를 위해 일단 서버쪽은 주석처리해둠
  // return axios({
  //   method: "POST",
  //   usrl: "/",
  //   data: {
  //     token: token,
  //   },
  // })
  //   .then((res) => {
  //     return dispatch(
  //       userInfoUpdate(res.data.username, res.data.usernickname, res.data.token)
  //     );
  //   })
  //   .catch((error) => {
  //     return dispatch(logout());
  //   });
};

//액션 생성함수
export function register() {
  return {
    type: AUTH_REGISTER,
  };
}

export function registerSuccess() {
  return {
    type: AUTH_REGISTER_SUCCESS,
  };
}

export function registerFailure(error) {
  return {
    type: AUTH_REGISTER_FAILURE,
    error,
  };
}

export function login() {
  return {
    type: AUTH_LOGIN,
  };
}

export function loginSuccess(username, nickname,token) {
  return {
    type: AUTH_LOGIN_SUCCESS,
    username,
    nickname,
    token
  };
}

export function loginFailure() {
  return {
    type: AUTH_LOGIN_FAILURE,
  };
}

export const logout = () => {
  return {
    type: AUTH_LOGOUT,
  };
};

export const userInfoUpdate = (username,nickname,token) => {
  return {
    type: USER_INFO_UPDATE,
    username,
    nickname,
    token,
  };
};

//리듀서
const auth = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_REGISTER:
      return {
        ...state,
        register: {
          status: "WAITING",
          error: -1,
        },
      };
    case AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        register: {
          ...state.register,
          status: "SUCCESS",
        },
      };
    case AUTH_REGISTER_FAILURE:
      return {
        ...state,
        register: {
          status: "FAILURE",
          error: action.error,
        },
      };
    case AUTH_LOGIN:
      return {
        ...state,
        login: {
          status: "WAITING",
        },
      };
    case AUTH_LOGIN_SUCCESS:
      sessionStorage.setItem('count', 0);
      sessionStorage.setItem(
        "userInfo",
        JSON.stringify({
          username: action.username,
          nickname: action.nickname,
          token: action.token,
        })
      );
      return {
        ...state,
        login: {
          status: "SUCCESS",
        },
        status: {
          ...state.status,
          isLoggedIn: true,
          currentUser: action.username,
          currentNickname: action.nickname,
        },
      };
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        login: {
          status: "FAILURE",
        },
      };
    case AUTH_LOGOUT:
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("count");
      return {
        ...state,
        status: {
          ...state.status,
          isLoggedIn: false,
          currentUser: "",
          currentNickname: "",
        },
      };
    case USER_INFO_UPDATE:
      sessionStorage.setItem(
        "userInfo",
        JSON.stringify({
          username: action.username,
          nickname: action.nickname,
          token: action.token,
        })
      );
      return {
        ...state,
        login: {
          status: "SUCCESS",
        },
        status: {
          ...state.status,
          isLoggedIn: true,
          currentUser: action.username,
          currentNickname: action.nickname,
        },
      };
    default:
      return state;
  }
};
export default auth;

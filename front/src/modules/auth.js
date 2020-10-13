import axios from "axios";

//액션 타입 만들기
const AUTH_LOGIN = "AUTH_LOGIN"; //로그인
const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";
const AUTH_LOGOUT = "AUTH_LOGOUT"; //로그아웃
const AUTH_REGISTER = "AUTH_REGISTER"; //회원가입
const AUTH_REGISTER_SUCCESS = "AUTH_REGISTER_SUCCESS";
const AUTH_REGISTER_FAILURE = "AUTH_REGISTER_FAILURE";
// const AUTH_USER_INFO = "AUTH_USER_INFO"; //회원정보 가져오기
// const AUTH_USER_INFO_SUCCESS = "AUTH_USER_INFO_SUCCESS";
// const AUTH_USER_INFO_FAILURE = "AUTH_USER_INFO_FAILURE";

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
  // userInfo: {
  //   //내정보 같은데서 유저정보 확인할때를 위해 일단 만들어둠
  //   status: "INIT",
  //   username: "",
  //   nickname: "",
  //   email: "",
  // },
};

//thunk (middleware)
export function registerRequest(username, password, nickname, email) {
  return (dispatch) => {
    // Inform Register API is starting
    dispatch(register());

    return (
      axios
        //백엔드 주소확인하고 다시 고쳐
        .post("/user_create", {
          username,
          password,
          nickname,
          email,
        })
        .then((response) => {
          dispatch(registerSuccess());
        })
        .catch((error) => {
          //
          dispatch(registerFailure(error.response.data)); //백엔드에서 넘어오는거 보고 고쳐야댐
        })
    );
  };
}

export const loginRequest = (userid, password) => (dispatch) => {
  // Inform Login API is starting
  dispatch(login());

  // API REQUEST
  return (
    axios({
      method: "POST",
      url: 'http://localhost:5000/loginchk',
      data:{
        "userid": userid,
        "password": password
      }
    })
    .then((response) => {
      // SUCCEED
      dispatch(loginSuccess(userid, response.data.nickname));
    })
    .catch((error) => {
      // FAILED
      console.log('fail');
      dispatch(loginFailure()); //로그인은 에러처리없이 그냥 아이디 또는 비밀번호가 잘못되었습니다 보여주면됨
    })
  );
};

export const logoutRequest = () => (dispatch) => {
  return (
    //백엔드 주소확인하고 다시 고쳐
    axios
      .post("/logout")
      .then((response) => {
        dispatch(logout());
      })
  );
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

export function loginSuccess(username, nickname) {
  return {
    type: AUTH_LOGIN_SUCCESS,
    username,
    nickname,
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

//유저정보 조회 관련 일단 만들어두고 주석처리해둠
// export const userInfo = () => {
//   return {
//     type: AUTH_USER_INFO,
//   };
// };

// export const userInfoSuccess = (username, nickname, email) => {
//   return {
//     type: AUTH_USER_INFO_SUCCESS,
//     username,
//     nickname,
//     email,
//   };
// };

// export const userInfoFailure = () => {
//   return {
//     type: AUTH_USER_INFO_FAILURE,
//   };
// };

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
      return {
        ...state,
        status: {
          ...state.status,
          isLoggedIn: false,
          currentUser: ''
        }
      }
    // case AUTH_USER_INFO:
    //   return {
    //     ...state,
    //     userInfo: {
    //       ...state.userInfo,
    //       status: "WAITING",
    //     },
    //   };
    // case AUTH_USER_INFO_SUCCESS:
    //   return {
    //     ...state,
    //     userInfo: {
    //       status: "SUCCESS",
    //       username: action.username,
    //       nickname: action.nickname,
    //       email: action.email,
    //     },
    //   };
    // case AUTH_USER_INFO_FAILURE:
    //   return {
    //     ...state,
    //     userInfo: {
    //       ...state.userInfo,
    //       status: "FAILURE",
    //     },
    //   };

    default:
      return state;
  }
};
export default auth;

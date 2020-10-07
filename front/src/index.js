import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import {Provider} from 'react-redux';
import rootReducer from './modules'
import ReduxThunk from 'redux-thunk';


const middlewares = [ReduxThunk];


//thunk쓰면 액션뿐 아니라 함수도 디스패치 가능
const enhancer =
  process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares)) // 배포용
    : composeWithDevTools(applyMiddleware(...middlewares)); // 개발용

const store = createStore(rootReducer,enhancer); 
//console.log(store.getState());//스토어 상태확인


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);


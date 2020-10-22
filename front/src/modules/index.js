import { combineReducers } from 'redux';
import auth from './auth'
import room from './room'

const rootReducer = combineReducers({
    auth,
    room,
});

export default rootReducer;
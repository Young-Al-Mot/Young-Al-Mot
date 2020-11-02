import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import BaseContainer from"./containers/BaseContainer"
import Room from "./routes/Room";
import RoomList from "./routes/RoomList";
import notfound from "./routes/404notfound";


const GlobalStyle = createGlobalStyle`  
  body{
    margin:0;
  }
`;

const App = () => {


  return (
    <Router>
      <GlobalStyle/>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />  
        <Route path="/roomList" component={RoomList} />       
        <Route path="/room" component={Room} />        
        <Route path="/*" component={notfound} />        
      </Switch>
      <BaseContainer/>
    </Router>
  );
};

export default App;

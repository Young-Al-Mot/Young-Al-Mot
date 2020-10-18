import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import BaseContainer from"./containers/BaseContainer"

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
      </Switch>
      <BaseContainer/>
    </Router>
  );
};

export default App;

import React from 'react';
import Form from './Form'
import {
  Route,
  BrowserRouter
} from "react-router-dom";



export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    };
  }

  render() {

    return (
      <BrowserRouter>
         <Route
              path="/:senderId/:pageId/:source/:lang"
              exact
              strict
              render={props => <Form {...props} />}
         />
      </BrowserRouter>
    );
  }
}

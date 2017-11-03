/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
// import { Panel, Input, Button } from 'react-bootstrap';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import { FormControl, Checkbox } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';
import history from '../../core/history';
import axios from 'axios';



class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {identifier: '', password: ''};

    //this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(name, e) {
    var change = {};
    change[name] = e.target.value
    this.setState(change);  
  }

  state = {
    login: [],
    error: null,    
}

  handleSubmit() {
  var data = this.state

  axios.post('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/user/login', data, headers)
  .then(res => {
      const login =  res.data;
      console.log(login)      
      this.setState({
          login,

          error: null,
      });
      if(login.status == 200) {
        history.push('/')             
        window.localStorage.setItem("login", JSON.stringify(login));          
      }
  })
  .catch(err => {
    console.log('error')
      this.setState({
          error: err
      })          
      console.log(error)
      
  })
  }
  
   render() {
    return (
      <div className="col-md-4 col-md-offset-4">
        <div className="text-center">
          <h1 className="login-brand-text">My Tips</h1>
          <h3 className="text-muted">daily using Tips in one place</h3>
        </div>
  
        <Panel header={<h3>Please Sign In</h3>} className="login-panel">
  
          <div>
            <fieldset>
              <div className="form-group">
                <FormControl
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  name="name"
                  onChange={this.handleChange}
                  value={this.state.identifier}
                  onChange={this.handleChange.bind(this, 'identifier')}
                />
              </div>
  
              <div className="form-group">
                <FormControl
                  className="form-control"
                  placeholder="Password"
                  type="password"
                  name="password"
                  ref="newText"
                  value={this.state.password}
                  onChange={this.handleChange.bind(this, 'password')}
                />
              </div>
              <Checkbox label="Remember Me" > Remember Me </Checkbox>
              <Button type="submit" bsSize="large" bsStyle="success" onClick={this.handleSubmit} >Login</Button>
            </fieldset>
          </div>
  
        </Panel>
  
      </div>
  
    );
  }
  
}


//Login.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Login);

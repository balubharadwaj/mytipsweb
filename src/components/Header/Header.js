/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  ProgressBar
} from 'react-bootstrap';
import Navbar, {Brand} from 'react-bootstrap/lib/Navbar';
import history from '../../core/history';
import $ from "jquery";
import Sidebar from '../Sidebar';
import './Header.css';
import axios from 'axios';
import fABGY from './fABGY.png'


const logo = require('./logo.png');


class Header extends React.Component {

  constructor(props) {
    super(props);
  }

     state = {
      socialLogin: [],
      error: null,
      fbStatus: false
       }

 componentDidMount(){
      // Load the required SDK asynchronously for facebook, google and linkedin
      (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
      
      window.fbAsyncInit = function() {
          window.FB.init({
            appId      : "130038091090566",
            cookie     : true,  // enable cookies to allow the server to access the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.8' // use version 2.1
          });
      };
  }
  

  facebookLogin = () => {
      /*window.FB.login(
          this.checkLoginState(), 
          { scope : 'email, public_profile' } //Add scope whatever you need about the facebook user
      ); */
      
      window.FB.login(
          function(resp){
       //     console.log(resp)
              this.statusChangeCallback(resp);
          }.bind(this),{ scope : 'email,user_work_history,user_education_history,user_location,public_profile' });
  }
  
  checkLoginState() {
      alert("Checking Login Status")
      console.log( "Checking login status..........." );
      
      window.FB.getLoginStatus(function(response) {
          alert("FB Callback")
          console.log("----------->")
      //    console.log(response)
          this.statusChangeCallback(response);
      }.bind(this));
  }
  
  statusChangeCallback(response) {
    //  console.log('statusChangeCallback');
     // console.log(response);
      if (response.status === 'connected') {
          // Logged into your app and Facebook.
          this.fetchDataFacebook();
          
      } else if (response.status === 'not_authorized') {
          console.log('Import error', 'Authorize app to import data', 'error')
      } else {
          console.log('Import error', 'Error occured while importing data', 'error')
      }
  }
  
  fetchDataFacebook = () => {
     // console.log('Welcome!  Fetching your information.... ');
 

      window.FB.api('/me',{ locale: 'en_US', fields: 'name, email, gender, picture' }, function(userInfo) {
        if(userInfo) {
          var data = {
            firstName: userInfo.name,
            role: "USER",
            email: userInfo.email,
            gender: userInfo.gender,
            profilePic: userInfo.picture.data.url,
            socialType: "FACEBOOK",
          }          
          var  headers = {
            'Content-Type': 'application/json',
        }         
          axios.post('http://ec2-52-66-121-193.ap-south-1.compute.amazonaws.com/socialUser/create', data, headers)
          .then(res => {
            const socialLogin =  res.data;
            this.setState = ({
              socialLogin,    
                error: null,
            });
              history.push('/')        
              window.sessionStorage.setItem("login", JSON.stringify(socialLogin));                      
        })
        .catch(err => {
          console.log('error')
            this.setState({
                error: err
            })          
            console.log(error)
            
        })
       }      
      });
  }

  logout() {
    history.push('/');
    window.sessionStorage.removeItem("login")
}


 render () {
    
  return (
    <div id="wrapper" className="content">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
          <Navbar.Brand>
              <a href="" onClick={(e) => { e.preventDefault(); history.push('/'); }} >
                 &nbsp;Tips
              </a>
            </Navbar.Brand>
            <Navbar.Brand>
              <a href="" onClick={(e) => { e.preventDefault(); history.push('/category'); }} >
                 &nbsp;Category
              </a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Nav pullRight>
              { sessionStorage.login ?
                <Navbar.Brand>
                   <span onClick= {this.logout}> Logout </span>
                </Navbar.Brand> :
                
                 <div className="btn btn-social btn-facebook" onClick={ () => this.facebookLogin() }>
                    <span className="fa fa-facebook"></span>  Facebook Sign in
                </div> 
                /* <img onClick={ () => this.facebookLogin() } src={fABGY} title="facebook login" alt="facebook"/> */
            
              }
          
          </Nav>
        </Navbar>
  
    </div>
  );
}

}



// function toggleMenu(){
//     if($(".navbar-collapse").hasClass('collapse')){
//       $(".navbar-collapse").removeClass('collapse');
//     }
//     else{
//       $(".navbar-collapse").addClass('collapse');
//     }
//   }

export default Header;

import React from 'react';

import "./styles.css";

class LoginPage extends React.Component {
  constructor(props) {
    super(props) 
    this.state =  {
      pageState: "prompt"
    }

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.prompt = this.prompt.bind(this);
  }

  login() {
    this.setState({pageState: "login"})
  }
  register() {
    this.setState({pageState: "register"})
  }
  prompt() {
    this.setState({pageState: "prompt"})
  }

  renderPromptPage() {
    return (<div>
        <div className="backgroundLogin" onClick={this.props.closeHandler}></div>
        <div className="loginBoxContainer">
          <h1 className="loginHeader">Do you already have an account?</h1>
          <div className="loginYes">
            <h2>Yes</h2>
            <div className="purpleButton loginPageButton" onClick={this.login}>Login</div>
          </div>
          <div className="loginNo">
            <h2>No</h2>
            <div className="purpleButton loginPageButton" onClick={this.register}>Register</div>
          </div>
        </div>
      </div>);
  }

  renderLoginPage() {
    return (<div>
        <div className="backgroundLogin" onClick={this.props.closeHandler}></div>
        <div className="loginBoxContainer">
        <button className="backButton" onClick={this.prompt}>Back</button>
        <h1 className="lessPadding">Login</h1>
        <form className="accForm loginForm">
            <label>
              Username:
              <br></br>
              <input type="text" name="username" name="username"/>
            </label>
            <br></br>
            <br></br>
            <label>
              Password:
              <br></br>
              <input type="password" name="password" name="password"/>
            </label>
            <br></br>
            <br></br>
            <input type="submit" className="purpleButton loginPageButton" value="Login"/>
          </form>
        </div>
      </div>);
  }

  renderRegisterPage() {
    return (<div>
        <div className="backgroundLogin" onClick={this.props.closeHandler}></div>
        <div className="loginBoxContainer">
          <button className="backButton" onClick={this.prompt}>Back</button>
          <h1 className="lessPadding">Register</h1>
          <form className="accForm registerForm">
            <label>
              Username:
              <br></br>
              <input type="text" name="username" name="username"/>
            </label>
            <br></br>
            <br></br>
            <label>
              Password:
              <br></br>
              <input type="password" name="password" name="password"/>
            </label>
            <br></br>
            <br></br>
            <label>
              Repeat Password:
              <br></br>
              <input type="password" name="repeatPassword" name="Password"/>
            </label>
            <br></br>
            <br></br>
            <input type="submit" className="purpleButton loginPageButton" value="Register"/>
          </form>
        </div>
      </div>);
  }

  pageHandler() {
    if (this.state.pageState === "prompt") {
      return this.renderPromptPage();
    }
    else if (this.state.pageState === "login") {
      return this.renderLoginPage();
    }
    else {
      return this.renderRegisterPage();;
    }
  }

  render() {
    return this.pageHandler();
  }
}

export default LoginPage;

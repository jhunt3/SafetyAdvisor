import React from 'react';

import "./styles.css";

class LoginPage extends React.Component {
  constructor(props) {
    super(props) 
    this.state =  {
      pageState: "prompt",
      user: "",
      pass: "",
      passVerification: ""
    }

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.prompt = this.prompt.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleChangePassVerification = this.handleChangePassVerification.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
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

  handleLoginSubmit(e) {
    e.preventDefault();
    if(this.props.handleLoginAttempt(this.state.user, this.state.pass)) {
      return;
    } else if (this.state.user === "") {
      alert("Username field is blank.");
      return;
    } else if (this.state.pass === "") {
      alert("Password field is blank.");
      return;
    }
    alert("Login Failed.");
  }
  handleRegisterSubmit(e) {
    e.preventDefault();
    if (this.state.user === "") {
      alert("Username field is blank.");
      return;
    } else if (this.state.pass === "") {
      alert("Password field is blank.");
      return;
    } else if (this.state.passVerification === "") {
      alert("Password Verification field is blank.");
      return;
    } else if (this.state.pass !== this.state.passVerification) {
      alert("Passwords do not match.");
      return;
    }
    alert("Registration has not been implemented yet.");
  }

  handleChangeUser(e) {
    this.setState({user: e.target.value});
  }
  handleChangePass(e) {
    this.setState({pass: e.target.value});
  }
  handleChangePassVerification(e) {
    this.setState({passVerification: e.target.value});
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
        <form className="accForm loginForm" onSubmit={this.handleLoginSubmit}>
            <label>
              Username:
              <br></br>
              <input type="text" name="user" value={this.state.user} onChange={this.handleChangeUser}/>
            </label>
            <br></br>
            <br></br>
            <label>
              Password:
              <br></br>
              <input type="password" name="pass" value={this.state.pass} onChange={this.handleChangePass}/>
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
          <form className="accForm registerForm" onSubmit={this.handleRegisterSubmit}>
            <label>
              Username:
              <br></br>
              <input type="text" name="user" onChange={this.handleChangeUser} value={this.state.user}/>
            </label>
            <br></br>
            <br></br>
            <label>
              Password:
              <br></br>
              <input type="password" name="pass" onChange={this.handleChangePass} value={this.state.pass}/>
            </label>
            <br></br>
            <br></br>
            <label>
              Repeat Password:
              <br></br>
              <input type="password" name="passVerification" onChange={this.handleChangePassVerification} value={this.state.passVerification}/>
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

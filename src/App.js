import React from 'react';
import Header from './components/Header'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/styles/rsuite-default.css'; 
import './App.css';
import Summery from './components/Summery';
import VisitList from './components/VisitList';
import Login from './screens/Login';
import ChangePassword from './components/ChangePassword'
// import ResetPassword from "./screens/ResetPassword"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Alert } from 'rsuite';


class App extends React.Component{
  
  state = {
    visitList:[],
    purpose:'Total',
    isLogin: false,
    rememberLoginKey: 'rememberLoginKey',
    isLoading: false,
    isChangePassword: false,
    token:'',
    summery:[],
    visits:[],
    tokenKey:'tokenKey'
  }

  psurposeChange = (value) =>{
    this.setState({purpose: value})
  }

  showLoginSpinner = () => {
    this.setState({isLoading: true})
  }

  hideLoginSpinner = () => {
    this.setState({isLoading: false})
  }

  showChangePassword = () => {
    this.setState({isChangePassword: true})
  }

  hideChangePassword = () => {
    this.setState({isChangePassword: false})
  }

  handleChangePasswordInput = (value)=> {
    this.setState({
      changePasswordForm: value
    });
  }

  changePassword = () => {

    const token = localStorage.getItem(this.state.tokenKey)
    const userEmail = JSON.parse(sessionStorage.getItem(this.state.rememberLoginKey)).email

    const changePasswordForm = this.state.changePasswordForm

    if(!changePasswordForm.currentPassword || !changePasswordForm.newPassword || !changePasswordForm.reTypePassword){
      alert('Please fill the form!')
      return
    }

    this.setState({isLoading:true})

    const headers = new Headers();
    headers.append('Content-Type', 'application/json;charset=UTF-8');
    headers.append('Accept', 'application/json');  
    headers.append('Origin','http://localhost:3000');
    headers.append('Access-Control-Allow-Credentials', 'true');

    headers.append('Authorization', `Token ${token}`);
    const url =`https://cors-anywhere.herokuapp.com/http://syntronic-visitorapp.eastus.cloudapp.azure.com:8000/api/v1/changePassword/${userEmail}`

    let req = new Request(url, {
        headers: headers,
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(changePasswordForm)
    });

    fetch(req)
    .then(res => res.json())
    .then(data => {
      if(data.Error){
        alert(data.Error)
      } else {

        Alert.success("Password changed success!")

        this.hideChangePassword()
      }
      this.setState({isLoading:false})
    })

  }

  login = () => {
    this.getSummery()
    this.setState({isLogin:true})
  }

  logout = () => {
    this.setState({isLogin:false})
    localStorage.removeItem(this.state.rememberLoginKey)
    sessionStorage.removeItem(this.state.rememberLoginKey)
  }

  checkIsRemenberLogin = () => {
    if(localStorage.getItem(this.state.rememberLoginKey)){
      const loginData = JSON.parse(localStorage.getItem(this.state.rememberLoginKey))
      const now = Date.now()
      if((now - loginData.remenberTime) < 86400 * 14){
        this.login()
      } else {
        alert('Your log in status has been expired, please log in again.')
        this.logout()
      }
    }
  }

  checkIsRefreshInLogin = () => {
    if(sessionStorage.getItem(this.state.rememberLoginKey) && localStorage.getItem(this.state.tokenKey)){
      
      this.login()
      
    } else {
      this.checkIsRemenberLogin()
    }
  }

  settingsOnSelect = (eventKey) => {
    if(eventKey === 2){
      this.logout()
    } else {
      this.showChangePassword()
    }
  }

  getSummery = (from, to) => {
    const token = localStorage.getItem(this.state.tokenKey)

    const headers = new Headers();
    headers.append('Content-Type', 'application/json;charset=UTF-8');
    headers.append('Accept', '*/*');
    headers.append('Authorization', `Token ${token}`);
    let url ='https://cors-anywhere.herokuapp.com/http://syntronic-visitorapp.eastus.cloudapp.azure.com:8000/api/v1/visit/Summarization'

    if(from && to){
      url =`https://cors-anywhere.herokuapp.com/http://syntronic-visitorapp.eastus.cloudapp.azure.com:8000/api/v1/visit/Summarization/?start_from=${from}&start_to=${to}`
    }

    let req = new Request(url, {
        headers: headers,
        method: 'GET',
        mode: 'cors'
    });

    fetch(req)
    .then(res => res.json())
    .then(data => {
      this.setState({summery: data})
    })
    .catch(err=>{
      console.log(err)
      this.hideLoginSpinner()
    })
  }

  componentDidMount(){
    this.checkIsRefreshInLogin()
    window.addEventListener('resize', this.trackWindowSize)
  }


  render(){

    if(!this.state.isLogin){
      return <Login login={this.login} showLoginSpinner={this.showLoginSpinner} hideLoginSpinner={this.hideLoginSpinner} isLoading={this.state.isLoading}/>
    }

    return (
      <Router className="App" basename="/syntronic-frontend-dashbord">
        <Header settingsOnSelect={this.settingsOnSelect}/>
        <Switch>
        {/* <Route path="/resetPassword">
          <ResetPassword/>
        </Route> */}
          <Route path="/"> 
          <ChangePassword isLoading={this.state.isLoading} showChangePassword={this.showChangePassword} hideChangePassword={this.hideChangePassword} isChangePassword={this.state.isChangePassword} handleChangePasswordInput={this.handleChangePasswordInput} changePassword={this.changePassword}/>
            <Summery summeryData={this.state.summery}/>
            <VisitList getSummery={this.getSummery} visitList={this.state.visitList} purpose={this.state.purpose} psurposeChange={this.psurposeChange}/>
          </Route>
        </Switch>

      </Router>
    )

  }

}

export default App;

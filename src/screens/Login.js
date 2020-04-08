import React from 'react';
import LoginForm from '../components/loginPage/LoginForm'
import ForgetPassword from '../components/loginPage/ForgetPassword'

class Login extends React.Component{

    state={
        isHidePassword:true,
        loginInput:{
            userEmail:'',
            userPassword:''
        },
        rememberLoginKey: 'rememberLoginKey',
        isRememberLogin: false,
        isForgetPassword: false,
        tokenKey:'tokenKey',
        token:''
    }

    toggleHidePassword = () => {
        if(this.state.isHidePassword){
            this.setState({isHidePassword:false})
        } else {
            this.setState({isHidePassword:true})
        }
    }

    forgetPasswordForm = () =>{
        this.setState({isForgetPassword: true})
    }

    logInForm = () => {
        this.setState({isForgetPassword: false})
    }

    handleRememberLogin = ({target:{checked}}) => {
        console.log(checked)
        this.setState({isRememberLogin: checked})
    }

    handleLoginChange = ({target: {id, value}}) => {
        const newValue = {...this.state.loginInput, [id]: value}
        this.setState({loginInput: newValue})
    }

    getToken = () => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Accept', '*/*');

        const po = 'https://cors-anywhere.herokuapp.com/'
        const url ='http://syntronic-visitorapp.eastus.cloudapp.azure.com:8000/api/v1/auth/getToken'

        let req = new Request(po+url, {
            headers: headers,
            method: 'POST',
            // mode: 'cors',
            body: JSON.stringify({
                username: 'cmdops',
                password: 'cmdops123'
            })
        });

        fetch(req)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            this.setState({token: data.token})
            localStorage.setItem(this.state.tokenKey, data.token)
        })
    }

    login = () =>{
        const loginInput = this.state.loginInput

        if(!loginInput.userEmail?.trim()){
            alert('please enter username!')
            return
        }

        if(!loginInput.userPassword?.trim()){
            alert('please enter password!')
            return
        }

        this.props.showLoginSpinner()
        const token = localStorage.getItem(this.state.tokenKey)

        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Accept', '*/*');
        headers.append('Authorization', `Token ${token}`);

        const po = 'https://cors-anywhere.herokuapp.com/'
        const url ='http://syntronic-visitorapp.eastus.cloudapp.azure.com:8000/api/v1/userAuthentication/authenticate'

        let req = new Request(po+url, {
            headers: headers,
            method: 'POST',
            // mode: 'cors',
            body: JSON.stringify(loginInput)
        });

        fetch(req)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.authenticated){

                if(this.state.isRememberLogin){ // if remenber login

                    const loginData = {
                        remenberTime: Date.now(),
                        email:loginInput.userEmail
                    }

                    localStorage.setItem(this.state.rememberLoginKey, JSON.stringify(loginData))

                } else { 
                    localStorage.removeItem(this.state.rememberLoginKey)
                }

                const userInfo = {
                    email: loginInput.userEmail
                }
                sessionStorage.setItem(this.state.rememberLoginKey, JSON.stringify(userInfo)) // for refresh page.

                this.props.login(this.state.token)
                this.props.hideLoginSpinner()
            } else {
                this.props.hideLoginSpinner()
                alert("Invalid username or password.")
            }
        })

    }

    componentDidMount(){
        this.getToken()
    }

    render(){
        return(
        <div className="loginPage">
            {
                this.state.isForgetPassword?
                (<ForgetPassword logInForm={this.logInForm}/>) :
                (<LoginForm isHidePassword={this.state.isHidePassword} handleLoginChange={this.handleLoginChange} login={this.login} toggleHidePassword={this.toggleHidePassword} handleRememberLogin={this.handleRememberLogin} isLoading={this.props.isLoading} forgetPasswordForm={this.forgetPasswordForm}/>)
            }
        </div>
        )
    }
}

export default Login
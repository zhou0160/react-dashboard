import React from 'react';
import Logo from '../../image/Syntronic-logo.png'
import { Icon } from 'rsuite';

function LoginForm(props){
    return(
        <div className="loginForm">
                <img className="loginLogo" src={Logo}/>
                <form className="loginInputs">
                    <input className="loginUsername" type="text" placeholder="Username" id="userEmail" onChange={props.handleLoginChange}/>
                    <div className="loginPasswordDiv">
                        <input className="loginPassword" onSubmit={props.login} id="userPassword" type={props.isHidePassword? "password" : "text"} placeholder="Password" onChange={props.handleLoginChange}/>
                        <a className="toggleHidePasswordBtn" onClick={props.toggleHidePassword}>
                            {
                                props.isHidePassword?
                                (<i className="far fa-eye-slash"></i>):
                                (<i className="far fa-eye" ></i>)
                            }
                        </a>
                    </div>
                    <div className="renmenberDiv">
                        <input type="checkbox" className="renmenberInput" id="renmenberLogin" name="renmenberLogin" onChange={props.handleRememberLogin}/>
                        <label htmlFor="renmenberLogin">Remember Me</label>
                    </div>
                </form>
                <div className="loginActions">
                    <button className="loginBtn" onClick={props.login}>
                        Log in 
                        {props.isLoading? <span>&nbsp;<Icon icon="spinner" pulse /></span> : ''}
                    </button>
                    <p onClick={props.forgetPasswordForm}>Forget Password?</p>
                </div>
            </div>
    )
}

export default LoginForm
import React from 'react';
import Logo from '../../image/Syntronic-logo.png'
import { Icon } from 'rsuite';

function ForgetPassword(props){
    return(
        <div className="forgerPasswordForm">
                <img className="loginLogo" src={Logo}/>
                <form className="forgerPasswordInputs">
                    <p>We'll send a recovery link to:</p>
                    <input type="text" placeholder="Enter email"/>
                </form>
                <div className="loginActions">
                    <button className="loginBtn" onClick={props.login}>
                        Send recovery link 
                        {props.isLoading? <span>&nbsp;<Icon icon="spinner" pulse /></span> : ''}
                    </button>
                    <p onClick={props.logInForm}>Return to log in.</p>
                </div>
        </div>
    )
}

export default ForgetPassword
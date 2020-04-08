import React from 'react';
import Logo from '../image/Syntronic-logo.png'
import UserSetting from './UserSetting'

function Header(props){
    return(
        <header>
            <div id="headerDiv">
                <img className="logo" src={Logo} alt="logo"/>
                <p>Visitor Assistant Report</p>
            </div>
            <UserSetting settingsOnSelect={props.settingsOnSelect}/>
        </header>
    )
}

export default Header
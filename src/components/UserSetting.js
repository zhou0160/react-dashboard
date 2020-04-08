import React from 'react';
import { Dropdown } from 'rsuite';
import { Link } from 'react-router-dom'

import User from '../image/user.png'

export default function UserSetting(props){

    return(<Dropdown onSelect={props.settingsOnSelect} icon={<img className="user" src={User} alt="user"/>} placement="bottomEnd">
            <Dropdown.Item eventKey={1}>Change Password</Dropdown.Item>
            <Dropdown.Item eventKey={2}>Log Out</Dropdown.Item>
        </Dropdown>)
}

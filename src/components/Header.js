import React from 'react';
import { Menu } from 'antd';
import { Link } from "react-router-dom";
import { HeartOutlined, HomeFilled , DeleteFilled } from '@ant-design/icons';

function Header(){

    function quitarToken(){
        localStorage.setItem('token', '');
    }


    return(
        <React.Fragment>
            <Menu mode="horizontal" >
                <Menu.Item key="events" icon={<HeartOutlined />}>
                    <Link to="/eventos">Events</Link>
                </Menu.Item>
                <Menu.Item key="myevents" icon={<HomeFilled />}>
                    <Link to="/miseventos">My events</Link>
                </Menu.Item>
                <Menu.Item key="logout" icon={<DeleteFilled />}>
                    <Link to="/" onClick={quitarToken}>Log Out</Link>
                </Menu.Item>
            </Menu>
        </React.Fragment>
    )
}

export default Header
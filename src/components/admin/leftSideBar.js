import React,{ Component } from "react";
import { NavLink } from "react-router-dom";

class LeftSideBar extends Component {

    render(){
        
        return (

            <div className="page-sidebar" id="sidebar">

                <div className="sidebar-header-wrapper">
                    <input type="text" className="searchinput"/>
                    <i className="searchicon fa fa-search"></i>
                    <div className="searchhelper">Search Reports, Charts, Emails or Notifications</div>
                </div>

                <ul className="nav sidebar-menu">

                    <li className={ this.props.location && this.props.location.pathname === '/admin/dashboard' ? 'active' : '' }>
                        <NavLink to="/admin/dashboard">
                            <i className="menu-icon glyphicon glyphicon-home"></i>
                            <span className="menu-text"> Dashboard </span>
                        </NavLink>
                    </li>

                    <li className={ this.props.location &&  this.props.location.pathname === '/admin/roles' ? 'active' : '' }>
                        <NavLink to="/admin/roles" >
                            <i className="menu-icon glyphicon glyphicon-registration-mark"></i>
                            <span className="menu-text"> Roles </span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/admin/logout" >
                            <i className="menu-icon glyphicon glyphicon-log-out"></i>
                            <span className="menu-text"> Logout </span>
                        </NavLink>
                    </li>

                </ul>


            </div>

        );
    }
}

export default LeftSideBar;
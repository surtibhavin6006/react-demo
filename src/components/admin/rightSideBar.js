import React,{ Component } from "react";
import { Switch,Route } from "react-router-dom";
import BreadCrumbs from "./breadcrumbs";
import Dashboard from "./dashboard";
import Logout from "./logout";
import RoleIndex from "./role/index";

class RightSideBar extends Component {

    render(){

        return (

            <div className="page-content">

                <BreadCrumbs/>

                <div className="page-header position-relative">
                    <div className="header-title">
                        <h1>
                            Dashboard
                        </h1>
                    </div>
                    <div className="header-buttons">
                        <a className="sidebar-toggler" href="/admin">
                            <i className="fa fa-arrows-h"></i>
                        </a>
                        <a className="refresh" id="refresh-toggler" href="/admin">
                            <i className="glyphicon glyphicon-refresh"></i>
                        </a>
                        <a className="fullscreen" id="fullscreen-toggler" href="/admin">
                            <i className="glyphicon glyphicon-fullscreen"></i>
                        </a>
                    </div>
                </div>

                <div className="page-body">
                    <Switch>
                        <Route exact path="/admin/dashboard" component={Dashboard}/>
                        <Route  path="/admin/roles" component={RoleIndex}/>
                        {/* <Route exact path="/admin/roles/edit/:id" component={RoleEdit}/> */}
                        <Route exact path="/admin/logout" component={Logout}/>
                    </Switch>
                </div>
            </div>
        );
    }
}


export default RightSideBar;
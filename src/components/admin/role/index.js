import React,{ Component } from "react";
import { Switch,Route } from "react-router-dom";
import RoleList from "./list";
import RoleEdit from "./edit";

class RoleIndex extends Component {

    render(){

        const rootPath = this.props.match.path;

        return (

            
            <Switch>
                <Route exact path={rootPath} component={RoleList}/>
                <Route exact path={rootPath + "/edit/:id"} component={RoleEdit}/>
            </Switch>
                
        );
    }
}


export default RoleIndex;
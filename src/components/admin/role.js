import React,{ Component } from "react";

import { connect } from "react-redux";
import { profileInfo } from "../../redux/actions/user";
import TableComponent from "../other/TableComponent";
import RoleService from "../../services/role";
import HelperLocalStorage from "../../helpers/local-storage-helper";


const mapDispatchToPros = (dispatch) => {
    return {
        setProfileInfo : (user) => dispatch(profileInfo(user))
    };
};

const mapStateToPros = (state) => {
    return {
        user : state.user
    }
};


class RoleClass extends Component {

    constructor(props){
        
        super(props);

        this.state = {
            data : null,
            table : {
                heading : 'Custom Table Header', //option
                className : 'customclass', //option
                footer : 'Footer ', //option
                noRecordFoundText : 'There are no records', //option
                headers : [ 
                    {
                        title : 'Name', //option
                        data : 'name', // required
                        sortable : false, // option
                        render : function(data) { return data.name;  }  //option
                    },
                    {
                        data : 'description', // required
                    }
                ],
                editable : {
                    path : 'admin/roles/edit/:id'
                }
            }
        }

        this.roleService = new RoleService();

        
    }

    componentDidMount(){
        this.__loadRoles();
    }

    __loadRoles(){
        
        this.roleService.all()
            .then((response) => {
                if(!response.ok){
                    HelperLocalStorage.handle(response);
                    return false;
                }

                return response;
            }).then((response) => {
                if(response){
                    return response.json();
                }
                return false;
            }).then((data) => {

                if(this.state.data === null){
                    this.setState({data : data.data});
                    
                }
            }).catch((error) => {
                alert('error')
            });
    }

    render(){
        
        return (

            <div className="row">
                {
                    this.state.data ? <TableComponent data={this.state.data} table={this.state.table} /> : "Loading"
                }
            </div>

        );
    }
}

const Role = connect(mapStateToPros, mapDispatchToPros)(RoleClass);
export default Role;
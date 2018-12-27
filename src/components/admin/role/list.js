import React,{ Component } from "react";

import { connect } from "react-redux";
import { profileInfo } from "../../../redux/actions/user";
import TableComponent from "../../other/TableComponent";
import RoleService from "../../../services/role";
import HelperLocalStorage from "../../../helpers/local-storage-helper";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import {NotificationContainer} from 'react-notifications';
import uuidv1 from 'uuid/v1';


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


class RoleListClass extends Component {

    constructor(props){
        
        super(props);

        this.roleService = new RoleService();
        this.__deleteRole = this.__deleteRole.bind(this);
        this.__loadRoles = this.__loadRoles.bind(this);

        this.state = {
            data : {},
            table : {
                heading : 'Custom Table Header', //option
                className : 'customclass', //option
                footer : 'Footer ', //option
                noRecordFoundText : 'There are no records', //option
                headers : { 
                    fields : [
                        {
                            title : 'Name', //option
                            data : 'name', // required
                            sortable : false, // option
                            render : data => { return data.name;  },  //option
                        },
                        {
                            data : 'description', // required
                        }
                    ],
                    rowActions : {
                        title : 'Actions',
                        actions : {
                            edit : {
                                path : data => { 
                                    return '/admin/roles/edit/'+data.id 
                                },
                                /* show : function (data) { 
                                
                                    if(data.id === '1' || data.id === 1) {  
                                        return false 
                                    } 
                                
                                    return true; 
                                
                                }, */
                                show : true,
                                title : <i className="fa fa-edit"></i>
                            },
                            delete : {
                                /* path : data => { 

                                    // return this.__deleteRole(data);
                                    
                                    return '/admin/roles/delete/'+data.id
                                }, */
                                show : data => { 
                                
                                    if(data.id === '1' || data.id === 1) {  
                                        return false 
                                    } 
                                
                                    return true; 
                                
                                },
                                title : <i className="fa fa-remove danger"></i>,
                                method : data => {


                                        return <button onClick={() => this.__confirmDeleteRole(data)}>Delete</button>

                                       
                                }
                            }
                        }
                    }
                }
            }
        }

        
    }

    __confirmDeleteRole(data){

        const options = {
            title: 'Delete',
            message: 'Are you sure want to delete it?',
            childrenElement: () => <div />,
            customUI: ({ title, message, onClose }) => <div className="custom-ui"><h1>{title}</h1><p>{message}</p><button onClick={ () => onClose()  }>No</button><button onClick={ () => this.__deleteRole(data,onClose) }>Yes, Delete it!</button></div>,
            willUnmount: () => {}
        }
         
        confirmAlert(options);
    }
    

    __deleteRole(data,onClose){
        
        this.roleService.delete(data.id)
            .then(response => {
                if(!response.ok){
                    this.roleService.__handleError();
                    return false;
                }

                return response;
            }).then((response) => {
                if(response){
                    return response.json();
                }
                return false;
            }).then(response => {

                if(response.success === "true"){

                    console.log(response);
                    let notification = {
                        message : response.message,
                        type : 'success',
                    }

                    this.roleService.__notification(notification);

                    this.setState({
                        redirecToIndex : true,
                    }); 

                    this.__loadRoles();

                }

                onClose();

            });
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
            }).then(data => {
                
                this.setState({data : data.data});
                return true;
                
            }).catch((error) => {
                alert('error');
                return false;
            });
    }

    render(){
        
        return (

            <div className="row">
                <NotificationContainer/>
                {
                    this.state.data ? <TableComponent key={uuidv1()} data={this.state.data} table={this.state.table} /> : "Loading"
                }
            </div>

        );
    }
}

const RoleList = connect(mapStateToPros, mapDispatchToPros)(RoleListClass);
export default RoleList;
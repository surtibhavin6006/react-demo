import React,{ Component } from "react";

import { connect } from "react-redux";
import Validation from "../../../validation/Validation";
import RoleService from "../../../services/role";
import {NotificationContainer} from 'react-notifications';

const mapStateToPros = (state) => {
    return {
        user : state.user
    }
};

class RoleEditClass extends Component {

    constructor(props){
        super(props);

        this.state = {
            fields : {
                id : props.match.params ? props.match.params.id : '',
                name : '',
                description : ''
            },
            validation : {
                rules : {
                    name : ['required'],
                }
            },
            redirecToIndex : false,
            action : props.match.params && props.match.params.id ? 'Edit' : 'Add'
        }

        this.__handleSubmit = this.__handleSubmit.bind(this);
        this.__handleChange = this.__handleChange.bind(this);
        this.__getData = this.__getData.bind(this);

        this.roleService = new RoleService();
    }

    componentDidMount(){
        this.__getData();
    }

    __getData(){

        let {fields} = this.state;

        if(fields.id){

            this.roleService.getById(fields.id)
                .then(response => {

                    if(!response.ok){

                        this.roleService.__handleError(response);
                        return false;

                    }
    
                    return response;

                }).then((response) => {

                    if(response){
                        
                        return response.json();
                    }

                    return false;

                }).then((data) => {
    
                    if(data.success === "true"){
                        
                        let {fields} = this.state;
                        fields['name'] = data.data.name;
                        fields['description'] = data.data.description;
                        
                        this.setState({
                            fields : fields,
                        });

                        return true;

                    }
    
                }).catch((error) => {

                    console.log('error',error);
                });


        }

    }

    __handleSubmit(event){
        event.preventDefault();
        
        this.roleService.save(this.state.fields)
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
            }).then(data => {

                if(data.success === "true"){

                    console.log(data);
                    this.setState({
                        redirecToIndex : true,
                    });  
                    
                    let notification = {
                        message : data.message,
                        type : 'success',
                    }

                    this.roleService.__notification(notification);

                }

            });
    }

    __handleChange(event) {

        let {fields} = this.state;

        fields[event.target.name] = event.target.value;
        console.log('ccc',fields);
        this.setState({ fields : fields});
        
        let response = Validation.validate(this.state.validation,fields);
        let validation = {...this.state.validation};
        validation['messages'] = response.messages;
        validation['hasError'] = response.hasError;
        this.setState({ validation : validation });

    }

    render(){

        const {name,description,id} = this.state.fields;
        const {messages,hasError} = this.state.validation;
        const {action,redirecToIndex} = this.state;
        
        return (

            <div className="row">
                <div className="widget">
                    <div className="widget-body">
                        <NotificationContainer/>
                        <form className="form-horizontal form-bordered" onSubmit={this.__handleSubmit}>
                            <div className={ messages && messages.name ? "form-group has-error" : name ?  "form-group has-success" : "form-group" }>
                                <label htmlFor="roleName" className="col-sm-2 control-label no-padding-right">Name</label>
                                <div className="col-sm-10">
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        id="roleName" 
                                        name="name" 
                                        placeholder="Name" 
                                        value={name} 
                                        onChange={this.__handleChange}
                                    />
                                </div>
                            </div>

                            <div className={ messages && messages.description ? "form-group has-error" : description ?  "form-group has-success" : "form-group" }>
                                <label htmlFor="roleDescription" className="col-sm-2 control-label no-padding-right">Description</label>
                                <div className="col-sm-10">
                                    <textarea 
                                        type="text" 
                                        className="form-control" 
                                        id="roleDescription" 
                                        name="description"
                                        placeholder="Description"
                                        rows = {5} 
                                        value={description}
                                        onChange={this.__handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-sm-offset-2">
                                    <div className="col-sm-4">
                                        <button type="submit" className="btn btn-palegreen" disabled={ (hasError===false) || (action === 'Add') ? 'disabled' : '' } >Save</button>
                                    </div>
                                    <div className="col-sm-4">
                                        <button type="button" className="btn" onClick={ () => {this.props.history.push('/admin/roles')} } >&lt;&lt; Back</button>
                                    </div>
                                </div>
                            </div>

                            
                        </form>

                    </div>
                </div>
            </div>
        );
    }
}

const RoleEdit = connect(mapStateToPros, null)(RoleEditClass);
export default RoleEdit;
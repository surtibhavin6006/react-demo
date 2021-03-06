import React,{ Component } from "react";
import { Redirect } from "react-router-dom";

import Validation from "../../validation/Validation"
import ErrorMessage from "../validation/ErrorMessage";
import AuthService from "../../services/auth";

import HelperLocalStorage from "../../helpers/local-storage-helper";

import { connect } from "react-redux";
import { profileInfo } from "../../redux/actions/user";

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


class LoginClass extends Component {

    constructor(props){

        super(props);

        this.state = {
            fields : {
                email : '',
                password : ''
            },
            validation : {
                rules : {
                    email : ['required','email'],
                    password : ['required']
                }
            },
            redirectToReferrer : false,
            isAuthenticated : this.props.user.profile && this.props.user.profile.isAuthenticated === true ? true : HelperLocalStorage.getLoginInfo() ? true : false
        }

        this.__handleSubmit = this.__handleSubmit.bind(this);
        this.__handleChange = this.__handleChange.bind(this);

        this.authService = new AuthService();
    }

    __handleSubmit(event) {
        event.preventDefault();
        
        this.authService.login(this.state.fields)
            .then((response) => {
                if(!response.ok){
                    return false;
                }

                return response;
            }).then((response) => {
                if(response){
                    return response.json();
                }
                return false;
            }).then((data) => {

                if(data){

                    let userInfo = {};
                    userInfo['token'] = data.data.access_token;
                    userInfo['token_type'] = data.data.token_type;
                    userInfo['expires_in'] = data.data.expires_in;
                    userInfo['last_refresh_time'] = new Date().toLocaleString();

                    HelperLocalStorage.setLoginInfo(userInfo);

                    this.setState({redirectToReferrer : true});
                }

            });
    }

    __handleChange(event) {

        let fileds = {...this.state.fields};
        fileds[event.target.name] = event.target.value;
        this.setState({ fields : fileds});

        let response = Validation.validate(this.state.validation,fileds);
        let validation = {...this.state.validation};
        validation['messages'] = response.messages;
        validation['hasError'] = response.hasError;
        this.setState({ validation : validation });

    }

    render(){

        const {email,password} = this.state.fields;
        const {messages,hasError} = this.state.validation;
        const { from } = this.props.location.state || { from: { pathname: '/admin' } };
        const { redirectToReferrer,isAuthenticated } = this.state

        if (isAuthenticated === true) {
            return <Redirect to="/admin" />
        }

        if (redirectToReferrer === true) {
            return <Redirect to={from} />
        }

        return (
            <div className="login-container animated fadeInDown">
                <div className="loginbox bg-white">
                    <div className="loginbox-title">SIGN IN</div>
                    <form ref="vForm" onSubmit={this.__handleSubmit}>
                        <div className={ messages && messages.email ? "loginbox-textbox has-error" : email ?  "loginbox-textbox has-success" : "loginbox-textbox" } >
                            <input 
                                type="text" 
                                ref="loginName" 
                                name="email" 
                                className=  "form-control"
                                placeholder="Email" 
                                value={email} 
                                onChange={this.__handleChange} 
                                
                            />
                            { messages && messages.email ? <ErrorMessage errorMessage={messages.email} /> : '' }
                        </div>
                        <div className={ messages && messages.password ? "loginbox-textbox has-error" : email ?  "loginbox-textbox has-success" : "loginbox-textbox" }>
                            <input 
                                type="password" 
                                ref="loginPassword" 
                                name="password"  
                                className="form-control" 
                                placeholder="Password" 
                                value={password} 
                                onChange={this.__handleChange} 
                            />
                            { messages && messages.password ? <ErrorMessage errorMessage={messages.password} /> : '' }
                        </div>
                        <div className="loginbox-forgot">
                            <a href="/admin">Forgot Password?</a>
                        </div>
                        <div className="loginbox-submit">
                            <input type="submit" ref="loginSubmit" className="btn btn-primary btn-block" value="Login" disabled={ !hasError ? 'disabled' : '' } />
                        </div>
                    </form>
                </div>
                <div className="logobox">
                    Your logo here
                </div>
            </div>
        );

    }

}

const Login = connect(mapStateToPros, mapDispatchToPros)(LoginClass);
export default Login;
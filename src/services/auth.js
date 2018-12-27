import BaseService from "./baseService";

export default class AuthService extends BaseService {

    login(userData){

        let params = {
            email: userData.email,
            password: userData.password
        }

        return this.__authFetch("login","POST",params);

    }

    me(){
        return this.__authFetch("me","GET");
    }

    logout(){
        return this.__authFetch("logout","GET");
    }
}
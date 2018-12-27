import React,{ Component } from "react";
import { Route,Switch } from "react-router-dom";
import Login from "./admin/login";
import Home from "./admin/home";
import PrivateRoute from "./admin/PrivateRoute";
import Loader from "./other/Loader";

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            loading : true
        }
    }

    componentDidMount(){
        this.setState({loading:false})
    }

    render() {

        const {loading} = this.state;
        console.log(loading);

        return (
            <div>
                { loading ? <Loader/> : '' }
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute path="/admin" component={Home} />
                </Switch>
            </div>
        );

    }

}

export default App;
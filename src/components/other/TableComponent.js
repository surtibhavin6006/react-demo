import React,{ Component } from "react";
import uuidv1 from 'uuid/v1';
import { NavLink } from "react-router-dom";

class TableComponent extends Component {

    constructor(props){
        
        super(props);

        this.state = {
            data : props.data,
            headerFilelds : props.table.headers.fields,
            rowActions : props.table.headers.rowActions,
            heading : props.table.heading,
            noRecordFoundText : props.table.noRecordFoundText,
            className : ["well",props.table.className],
            footer : props.table.footer,
            finalData : null,
            finalHeader : null
        }

    }

    componentDidMount(){
        this.__loadHeader();
        this.__handleClass();
    }

    __loadHeader(){

        const { headerFilelds,data } = this.state;

        /**
         * Proceed only if we have header set.
         */
        if(headerFilelds){

            if(data && data.length > 0){

                this.__loadHeaderWithData(data,headerFilelds);

            } else {

                this.__loadHeaderWithOutData(headerFilelds);

            }
            
            
        }
        
    }

    /**
     *  Get finalHeader and finalData both from one loop if there is data else get only headers.
     */

    __loadHeaderWithData(data,headerFilelds){

        let finalData = [];
        let finalHeader = [];
        let iteration = 0;

        data.map(d => {

            let loopData = {};
            let loopDataFields = [];
            
            headerFilelds.map(headerFileld => {
                
                let title;
                let value;
                let dataInner = {};
                let headerInner = {};

                if(headerFileld.title !== undefined){
                    title = headerFileld.title;
                } else {
                    title = headerFileld.data;
                }

                if(headerFileld.render !== undefined && typeof headerFileld.render === 'function'){
                    value = headerFileld.render(d);
                } else {
                    value = d[headerFileld.data];
                }


                dataInner['value'] = value;
                dataInner['title'] = title;
                
                loopDataFields.push(dataInner);

                headerInner['title'] = title;
                if(headerFileld.sortable !== undefined){
                    headerInner['sortable'] = title;
                }

                if(iteration < 1){
                    finalHeader.push(headerInner);
                }

                return true;
            });

            loopData['fields'] = loopDataFields;

            /**
             * Code to add rawActions
             */
            const {rowActions} = this.state;

            if(rowActions){

                if(iteration < 1){

                    let title = 'Actions';

                    if(rowActions.title){
                        title = rowActions.title;
                    }

                    finalHeader.push({
                        title : title
                    });
                }

                if(rowActions.actions){

                    let actionLoop = [];

                    let actions = rowActions.actions;

                    Object.keys(actions).map(action => {

                        let title = action,show = true,navPath;

                        if(actions[action].show && typeof actions[action].show === 'function'){
                            show = actions[action].show(d);
                        } else if(actions[action].show === false){
                            show = false;
                        }

                        if(actions[action].title){
                            title = actions[action].title;
                        }

                        if(show){

                            if(actions[action].path){
                                navPath = <NavLink key={uuidv1()} to={actions[action].path(d)} >{title}</NavLink>;
                            } else {

                                if(actions[action].method){
                                    navPath = actions[action].method(d);
                                } else {
                                    navPath = <button key={uuidv1()} >{title}</button>;
                                }

                                
                            }
                        }

                        actionLoop.push(navPath ? navPath : '');

                        return true;
                    });
                    
                    loopData['actions'] = actionLoop;
                    
                }

                
            }

            finalData.push(loopData);
            iteration++;
            return true;
        });

        this.setState({finalData : finalData,finalHeader : finalHeader});
    }


    /**
     *  Get finalHeader only.
     */
    __loadHeaderWithOutData(headerFilelds){

        let title;
                
        let finalHeader = [];
        headerFilelds.map(headerFileld => {
            
            let headerInner = {};

            if(headerFileld.title !== undefined){
                title = headerFileld.title;
            } else {
                title = headerFileld.data;
            }

            headerInner['title'] = title;
            if(headerFileld.sortable !== undefined){
                headerInner['sortable'] = headerFileld.sortable;
            }

            finalHeader.push(headerInner);

            return true;
        });

        this.setState({finalHeader : finalHeader});
    }

    __handleClass(){

        let {className,heading,footer} = this.state;

        if(heading){
            className.push("with-header");
        }

        if(footer){
            className.push("with-footer");
        }

        this.setState({className : className});
    
    }

    __renderList(){
        
        const {finalHeader,finalData,noRecordFoundText} = this.state;
        
        if(finalData && Object.keys(finalData).length > 0){
            
            return <tbody> 
            {

                Object.keys(finalData).map(data => {

                    const fields = finalData[data].fields;
                    const actions = finalData[data].actions;

                    console.log(actions);

                    return <tr key={uuidv1()}> 
                        {
                            fields.map(d => {
                                return <td key={uuidv1()}>{d.value}</td>
                
                            })
                        }
                        <td key={uuidv1()}>
                            {
                                actions.map(d => {
                                    return <div key={uuidv1()}>{d}</div>
                                })
                            }
                        </td>
                    </tr>; 

                })
            }
            </tbody>;
        } else {
            return <tbody>
                        <tr>
                            <td colSpan={finalHeader.length}>
                                { noRecordFoundText ? noRecordFoundText : "No record found"}
                            </td>
                        </tr>
                    </tbody>
        }

    }

    /* componentDidUpdate(prevProps,prevState){
        
        if(this.props.data && prevProps.data && Object.keys(this.props.data).length  !== Object.keys(prevProps.data).length){
            alert('dxinner'+ Object.keys(this.state.data).length + '----' + Object.keys(prevState.data).length);
            //this.setState({data : false});
        }
        
    } */

    render(){

        const {finalHeader,heading,className,footer} = this.state;

        if(!finalHeader){
            return(
                <div className="col-xs-12 col-md-12">
                    Loading...
                </div>
            )
        }

        return (

            <div className="col-xs-12 col-md-12">
                <div className={ className.join(" ") }>
                    {
                        heading ? <div className="header bordered-success">{heading}</div> : ''
                    }
                    <div className="table-scrollable">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    {
                                        finalHeader.map(header => {
                                            return <th key={uuidv1()} scope="col">{header.title}</th>;
                                        })
                                    }
                                </tr>
                            </thead>
                                {
                                    this.__renderList()
                                }
                        </table>
                    </div>
                    {
                        footer ? <div className="footer">{footer}</div> : ''
                    }
                   
                </div>

            </div>

        );
    }
}

export default TableComponent;
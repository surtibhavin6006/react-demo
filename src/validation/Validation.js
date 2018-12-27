

export default class Validation{

    static validate(validation,data,message = {}){

        if(!this.validate.rules) {
            this.rules = validation.rules;
            this.data = data;
            this.message = message
            this.__validation();
        }

        let returnData = {
            hasError : Object.keys(this.message).length > 0 ? false : true,
            messages : this.message
        }

        return returnData;
    }

    static __validation(){
        
        Object.keys(this.rules).map(field => {
        
            this.rules[field].map((rule) => {
                
                switch(rule){
                    case 'required':
                        this.__required(field);
                        break;
                    case 'email':
                        this.__email(field);
                        break;
                    default:
                        if(typeof rule === "function"){
                            rule(this.data[field]);
                        }
                }
                
                return true;
            }); 
            
            return true;
        });
        
    }

    static __required(field){

        if(!this.data[field] && !this.message[field]){
            this.message[field] = field + ' is required';
        }

        return true;
    
    }

    static __email(field){

        if(!this.message[field]){

            let mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            
            if(!this.data[field].match(mailformat)){
                this.message[field] = field + ' is not valid email address';
            }

        }

        return true;
    
    }

    
}
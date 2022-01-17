export const inputDto=(data:any, context:string="create")=>{
    switch(context){
        case "create":
            return data
        default:
            return data;
    }
}

export const outputDto=(data:any, context:string="create")=>{
    switch(context){
        case "create":
            return data
        default:
            return data;
    }
}
import slugify from "slugify";

export const inputDto=(data:any, context:string="create")=>{
    switch(context){
        case "create":
            return {...data, slug:data.slug ?? slugify(data.slug)};
        case "update":
            return{
                ...data,
                ...(data.slug ? {slug:data.slug ?? slugify(data.slug)}:{}),
                updatedAt:new Date()
            }
            
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
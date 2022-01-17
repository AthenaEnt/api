import { Prisma } from "../../database/generated/client";;
import { CreateManyNestedField, CreateOneNestedField, UpdateManyNestedField, UpdateOneNestedField } from "../fun";

export const inputDto=(data:any, context:string="create")=>{
    const {userDetailsFiles,forUserId,  ...d}=data
    switch(context){
        case "createUserShipping":
            
            
            return {
                ...d,
                ...(Boolean(data?.audioFile) ? {audioFile:CreateOneNestedField(data?.audioFile, 'connect')} : {}),
                ...(d.userDetailsFiles ? {userDetailsFiles:CreateManyNestedField(data.userDetailsFiles.map((d:any)=>({id:d.id})), "connect")}:{}),
                forUser:CreateOneNestedField({id:forUserId}, 'connect'),
                shippingZone:CreateOneNestedField({id:data.shippingZone.id}, 'connect'),
            } 
        case "updateUserShipping":
            return {
                ...d,
                ...(Boolean(data?.audioFile) ? {audioFile:UpdateOneNestedField(data?.audioFile, 'connect')} : {}),
                ...(data.userDetailsFiles ? {userDetailsFiles:UpdateManyNestedField(data.metas, "connectOrCreate")}:{}),
                ...(data.forUser ? {forUser:UpdateOneNestedField({id:forUserId}, "connect")}:{}),
                ...(data.shippingZone ? {shippingZone:UpdateOneNestedField({id:data.shippingZone.id}, "connect")}:{})
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
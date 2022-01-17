import { Prisma } from "../../database/generated/client";;
import { prisma } from "../../database";
import { v4 } from "uuid"

export const getAllService=async (data:any, persist:boolean=true)=>{
    const format=(data:any):Prisma.ShippingRuleFindManyArgs=>{
        return data
    }
    try{
        if(persist){
            return await prisma.shippingRule.findMany(format(data))
        }else{
            return format(data)
        }
    }catch(e){
        return{
            _status:400,
            message:"Une erreur est survenue lors de la selection multiple.",
            details:e.message
        }
    }
}

export const getOneService=async (data:any, persist:boolean=true)=>{
    const format=(data:any):Prisma.ShippingRuleFindUniqueArgs=>{
        return {
            where:{
                id:data.id
            },...(data.select ? {select:data.select}:{})
        }
    }
    try{
        if(persist){
            return await prisma.shippingRule.findUnique(format(data))
        }else{
            return format(data)
        }
    }catch(e){
        return{
            _status:400,
            message:"Une erreur est survenue lors de la selection unique.",
            details:e.message
        }
    }
    
}

export const postService=async (data:any, persist:boolean=true)=>{
    const format=(data:any):Prisma.ShippingRuleCreateArgs=>{
        return {
            data:{
                id:v4(),
                ...data
            }
        }
    }
    try{
        if(persist){
            return await prisma.shippingRule.create(format(data))
        }else{
            return format(data)
        }
    }catch(e){
        return{
            _status:400,
            message:"Une erreur est survenue lors de la création.",
            details:e.message
        }
    }
}

export const updateService=async ({id, ...data}:any, persist:boolean=true)=>{
    const format=({id, ...data}:any):Prisma.ShippingRuleUpdateArgs=>{
        return {
            data,
            where:{
                id
            }
        }
    }
    try{
        if(persist){
            return await prisma.shippingRule.update(format({id, ...data}))
        }else{
            return format({id, ...data})
        }
    }catch(e){
        return{
            _status:400,
            message:"Une erreur est survenue lors de la mise à jour.",
            details:e.message
        }
    }
    
}

export const deleteService=async (data:any, persist:boolean=true)=>{
    const format=({id}:any):Prisma.ShippingRuleDeleteArgs=>{
        return {
            where:{
                id
            }
        }
    }
    try{
        if(persist){
            return await prisma.shippingRule.delete(format(data))
        }else{
            return format(data)
        }
    }catch(e){
        return{
            _status:400,
            message:"Une erreur est survenue lors de la suppression.",
            details:e.message
        }
    }
    
}

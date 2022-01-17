import { Prisma } from "../../database/generated/client";;
import { prisma } from "../../database";
import { v4 } from "uuid"

export const getAllService=async (data:any, persist:boolean=true)=>{
    const format=(data:any):Prisma.PriceRuleFindManyArgs=>{
        return data
    }
    try{
        if(persist){
            return await prisma.priceRule.findMany(format(data))
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
    const format=(data:any):Prisma.PriceRuleFindUniqueArgs=>{
        return {
            where:{
                id:data.id
            },...(data.select ? {select:data.select}:{})
        }
    }
    try{
        if(persist){
            return await prisma.priceRule.findUnique(format(data))
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
    const format=(data:any):Prisma.PriceRuleCreateArgs=>{
        return {
            data:{
                id:v4(),
                ...data
            }
        }
    }
    try{
        if(persist){
            return await prisma.priceRule.create(format(data))
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
    const format=({id, ...data}:any):Prisma.PriceRuleUpdateArgs=>{
        return {
            data,
            where:{
                id
            }
        }
    }
    try{
        if(persist){
            return await prisma.priceRule.update(format({id, ...data}))
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
    const format=({id}:any):Prisma.PriceRuleDeleteArgs=>{
        return {
            where:{
                id
            }
        }
    }
    try{
        if(persist){
            return await prisma.priceRule.delete(format(data))
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

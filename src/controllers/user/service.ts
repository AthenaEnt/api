import { Prisma } from "../../database/generated/client";;
import { prisma } from "../../database";
import { v4 } from "uuid"
import { CreateManyNestedField } from "../fun";

export const getAllService=async (data:any, persist:boolean=true)=>{
    const format=(data:any):Prisma.UserFindManyArgs=>{
        return data
    }
    try{
        if(persist){
            return await prisma.user.findMany(format(data))
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
    const format=(data:any):Prisma.UserFindUniqueArgs=>{
        return {
            where:{
                id:data.id
            },...(data.select ? {select:data.select}:{})
        }
    }
    try{
        if(persist){
            return await prisma.user.findUnique(format(data))
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
    const format=(data:any):Prisma.UserCreateArgs=>{
        return {
            data:{
                id:v4(),
                ...data,
            }
        }
    }
    try{
        if(persist){
            return await prisma.user.create(format(data))
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
    const format=({id, ...data}:any):Prisma.UserUpdateArgs=>{
        return {
            data,
            where:{
                id
            }
        }
    }
    try{
        if(persist){
            return await prisma.user.update(format({id, ...data}))
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
    const format=({id}:any):Prisma.UserDeleteArgs=>{
        return {
            where:{
                id
            }
        }
    }
    try{
        if(persist){
            return await prisma.user.delete(format(data))
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

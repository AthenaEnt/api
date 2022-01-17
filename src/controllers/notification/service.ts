import { Prisma } from "../../database/generated/client";;
import { prisma } from "../../database";
import { v4 } from "uuid"

export const getAllService=async (data:any, persist:boolean=true)=>{
    const format=(data:any):Prisma.NotificationFindManyArgs=>{
        return data
    }
    try{
        if(persist){
            return await prisma.notification.findMany(format(data))
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
    const format=(data:any):Prisma.NotificationFindUniqueArgs=>{
        return {
            where:{
                id:data.id
            },...(data.select ? {select:data.select}:{})
        }
    }
    try{
        if(persist){
            return await prisma.notification.findUnique(format(data))
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
    const format=(data:any):Prisma.NotificationCreateArgs=>{
        return {
            data:{
                id:v4(),
                ...data
            }
        }
    }
    try{
        if(persist){
            return await prisma.notification.create(format(data))
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

export const updateService=async (data:any, persist:boolean=true)=>{
    const format=({id, ...data}:any):Prisma.NotificationUpdateArgs=>{
        return {
            data,
            where:{
                id
            }
        }
    }
    const persistData=async(d)=>{
        if(persist){
            return await prisma.notification.update(format({id:d.id, ...d}))
        }else{
            return format(d)
        }
    }
    try{
        if(data instanceof Array){
            for(let i in data){
                await persistData(data[i])
            }
        }else{
            persistData(data)
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
    const format=({id}:any):Prisma.NotificationDeleteArgs=>{
        return {
            where:{
                id
            }
        }
    }
    try{
        if(persist){
            return await prisma.notification.delete(format(data))
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

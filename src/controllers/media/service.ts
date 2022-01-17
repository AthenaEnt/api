import { Prisma } from "../../database/generated/client";;
import { prisma } from "../../database";
import { v4 } from "uuid"

export const getAllService=async (data:any, persist:boolean=true)=>{
    const format=(data:any):Prisma.MediaFindManyArgs=>{
        return data
    }
    try{
        if(persist){
            return await prisma.media.findMany(format(data))
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
    const format=(data:any):Prisma.MediaFindUniqueArgs=>{
        return {
            where:{
                id:data.id
            },...(data.select ? {select:data.select}:{})
        }
    }
    try{
        if(persist){
            return await prisma.media.findUnique(format(data))
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
    const format=(data:any):Prisma.MediaCreateArgs|Array<Prisma.MediaCreateArgs>=>{
        if(data instanceof Array){
            return data.map((d:any)=>({data:{...d, id:v4()}}))
        }
        return {
            data:{
                id:v4(),
                ...data
            }
        }
    }
    try{
        if(persist){
            const d=format(data)
            const result=[]
            if(d instanceof Array){
                for(let i in d){
                    result.push(await prisma.media.create({...d[i]}))
                }   
                return result
            }else{
                return await prisma.media.create(d)
            }
            
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
    const format=(data:any):Prisma.MediaUpdateArgs|Array<Prisma.MediaUpdateArgs>=>{
        if(data instanceof Array){
            return data.map((d:any)=>({
                data:d, 
                where:{
                    id:d.id
                }
            }))
        }else{
            return {
                data,
                where:{
                    id:data.id
                }
            }
        }
    }
    
    try{
        const d=format(data)
        const result=[]
        if(d instanceof Array){
            for(let i in d){
                result.push(await prisma.media.update(d[i]))
            }   
            return result
        }else{
            return await prisma.media.update(d)
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
    const format=({id}:any):Prisma.MediaDeleteArgs=>{
        return {
            where:{
                id
            }
        }
    }
    try{
        if(persist){
            return await prisma.media.delete(format(data))
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

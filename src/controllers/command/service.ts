import { Prisma } from "../../database/generated/client";;
import { prisma } from "../../database";
import { v4 } from "uuid"

export const getAllService=async (data:any, persist:boolean=true)=>{
    const format=(data:any):Prisma.CommandFindManyArgs=>{
        return data
    }
    try{
        if(persist){
            return await prisma.command.findMany(format(data))
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
    const format=(data:any):Prisma.CommandFindUniqueArgs=>{
        return {
            where:{
                id:data.id
            },...(data.select ? {select:data.select}:{})
        }
    }
    try{
        if(persist){
            return await prisma.command.findUnique(format(data))
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
    const format=(data:any):Prisma.CommandCreateArgs=>{
        return {
            include:{
                receipt:true,
                shippingAdress:true,
                commandProducts:{
                    include:{
                        commandUnitProduct:true,
                        product:{
                            include:{
                                variantParent:true,
                                medias:true
                            }
                        }
                    }
                }
            },
            data:{
                id:v4(),
                ...data
            }
        }
    }
    try{
        if(persist){
            return await prisma.command.create(format(data))
        }else{
            return data
        }
    }catch(e){
        console.log(e)
        return{
            _status:400,
            message:"Une erreur est survenue lors de la création.",
            details:e
        }
    }
}

export const updateService=async ({id, ...data}:any, persist:boolean=true)=>{
    const format=({id, ...data}:any):Prisma.CommandUpdateArgs=>{
        return {
            data,
            where:{
                id
            }
        }
    }
    try{
        if(persist){
            return await prisma.command.update(format({id, ...data}))
        }else{
            return format({id, ...data})
        }
    }catch(e){
        console.log(e)
        return{
            _status:400,
            message:"Une erreur est survenue lors de la mise à jour.",
            details:e.message
        }
    }
    
}

export const deleteService=async (data:any, persist:boolean=true)=>{
    const format=({id}:any):Prisma.CommandDeleteArgs=>{
        return {
            where:{
                id
            }
        }
    }
    try{
        if(persist){
            return await prisma.command.delete(format(data))
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

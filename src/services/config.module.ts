import { prisma } from "../database";
import {v4} from "uuid"

export module ConfigModule{
   export const persistDefaultConfig=async(configObject:any, configKey?:string|string[])=>{
        let obj=configObject;
        const configContextError=[]
        if(configKey instanceof Array){
            configKey.forEach((c)=>{
                if(Object.keys(configObject).includes(c)){
                    obj[c]=configObject[c]
                }else{
                    configContextError.push({
                        status:400,
                        name:"DefaultConfigPersistanceError",
                        message:"Contexte invalide.",
                    })
                }
            })
        }else if(typeof configKey==="string"){
            if(Object.keys(configObject).includes(configKey)){
                obj=configKey ? {[configKey]: configObject[configKey]} : configObject
            }else{
                configContextError.push({
                    status:400,
                    name:"DefaultConfigPersistanceError",
                    message:"Contexte invalide.",
                })
            }
            
        }
        if(configContextError.length){
            return {
                status:400,
                name:"DefaultConfigPersistanceError",
                message:"Contexte Invalide.",
                details:configContextError
            }
        }
        const createMeta=async({name, key, value}, deleteOld=true)=>{
            if(deleteOld){
                await prisma.generalMeta.deleteMany({
                    where:{
                        key:{
                            equals:key
                        }
                    }
                })
            }
            
            await prisma.generalMeta.create({
                data:{
                    id:v4(),
                    name,
                    key,
                    value
                }
            })
        }
        try{
            if(typeof obj==="object" ){
                for(let i in obj){
                    if(obj[i] instanceof Array){
                        for(let j=0; j<obj[i].length; j++){
                            const {name, ...data}=obj[i][j]
                            await createMeta({name, key:i, value:data}, j===0)
                        }
                    }else if(typeof obj[i]==="object"){
                        const {name, ...data}=obj[i]
                        await createMeta({name, key:i, value:data})
                    }else{
                        await createMeta({name:"", key:i, value:obj[i]})
                    }
                }
            }
            return true
        }catch(e){
            console.log(e)
            return {
                status:400,
                name:"DefaultConfigPersistanceError",
                message:"Une erreur est survenue."
            }
        }
        
   }
}
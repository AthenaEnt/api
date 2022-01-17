import { readdirSync } from "fs"
import { resolve } from "path"
import axios from "axios";
import faker from "faker"
import { prisma } from "../database";


export const persistMedias=async (token)=>{
    const mediaDir=resolve(__dirname, "../..", "public", "uploads")
    const files=readdirSync(mediaDir);
    await createMedias(files, token)
    
}

export const uploadImages=async(images:Array<string>, token)=>{
    const result=[]
    const medias=await prisma.media.findMany()
    for(let i in images){
        const media= medias.find((m)=>m.filename===images[i].replace(/\s/g, ""))
        if(media){
            result.push(media) 
        }
    }
    return result
}

export const createMedias=async (files, token)=>{
    for(let i = 0; i<files.length; i++){
        const ext=files[i].slice(files[i].lastIndexOf('.')+1)
        const media={
            filename:files[i],
            fileType:"image/"+ext,
            path:"/uploads/"+files[i]
        }   
         
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
            const response=await axios.post('http://localhost:'+process.env.PORT+'/api/medias', {
                data:{
                    ...media
                }
            })
            response?.data
        }catch(e){
            console.log(JSON.stringify(e.response))
        }
    }
}
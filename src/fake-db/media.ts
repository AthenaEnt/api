import { readdirSync } from "fs"
import { resolve } from "path"
import axios from "axios";
import faker from "faker"
import { prisma } from "../database";
import {v4} from "uuid"


export const persistMedias=async (token)=>{
    const mediaDir=resolve(__dirname, "../..", "public", "uploads")
    const files=readdirSync(mediaDir);
    for(let i = 0; i<files.length; i++){
        const ext=files[i].slice(files[i].lastIndexOf('.')+1)
        const dir="public";
        const media={
            filename:files[i],
            fileType:"image/"+ext,
            path:"/uploads/"+files[i]
        }   
         
        try{
            await prisma.media.create({
                data:{
                    id:  v4(),
                    ...media
                }
            })
        }catch(e){
            console.log(JSON.stringify(e.response))
        }
    }
}
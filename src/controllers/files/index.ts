import express from "express"
import { unlink } from "fs"
import { prisma } from "../../database"
import { FileModule } from "../../services/file.module"
import {v4} from "uuid"
import { authOnlyAdmin } from "../auth/authenticator"


export const filesRouter=express.Router()

filesRouter
.use('/', FileModule.uploader.array('files'))
.post("/", async (req:any, res:any)=>{
    const dir="public"
    if(req.files){
        if(req.query.hasOwnProperty('p')){
            const files=[]
            for(let i=0; i<req.files.length; i++){
                let f=req.files[i]
                files.push(await prisma.media.create({
                    data:{
                        id:v4(),
                        fileType:f.mimetype,
                        filename:f.filename,
                        path:f.path.slice(f.path.indexOf(dir)+dir.length)
                    }
                }))
            }
            return res.status(200).json({data:files})
        }
        return res.status(200).json({data:req.files.map((f)=>({...f, path:f.path.slice(f.path.indexOf(dir)+dir.length)}))})
    }
    return res.status(400).json({error:{message:"Upload Failed."}})
})

export const rmFile=async(path:string)=>{
    return new Promise((res, rej)=>{
        unlink(path, (err)=>{
            if(err) rej(err);
            res(true)
        })
    })
}

filesRouter.delete("/",authOnlyAdmin, async (req, res)=>{
    const {files}=req.body
    
    if(files instanceof Array && files.length){
        const errors=[]
        for(let i = 0 ; i<files.length; i++){
            try{
                await rmFile(FileModule.getFileBase() +files[i])
            }catch(e){
                console.log(e)
                errors.push(e.message)
            }
        }
        if(errors.length){
            res.status(400).json({
                name:"FileDeletionFailed",
                message:"Certains fichiers n'ont pu etre correctement supprimés",
                status:400,
                details:errors
            })
        }else{
            res.status(200).json({
                name:"FilesDeletionSuccess",
                message:"Fichier(s) supprimé(s).",
                status:200
            })
        }
    }else{
        res.status(400).json({
            name:"FileDeletionFailed",
            message:"Mauvaise requete.",
            status:400
        })
    }
})
import express from "express"
import { defaultAdminConfig } from "../../config/admin.config"
import { ConfigModule } from "../../services/config.module"
import { authOnlyAdmin } from "../auth/authenticator"

export const configRouter=express.Router()

configRouter.post('/default',authOnlyAdmin, async (req, res)=>{
    let {context}=req.query || req.body
    context=typeof context==="string" ? (context.includes(',') ? context.split(',') :context) : context
    const result=await ConfigModule.persistDefaultConfig(defaultAdminConfig, context)
    if(result===true){
        return res.status(200).json({
            name:"DefaultConfigPersistanceSuccess",
            message:"Configuration restaurée.",
            status:200
        })
    }else{
        return res.status(400).json(result)
    }
})
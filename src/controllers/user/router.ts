import express from "express";
import { dtoResolver } from "../../common/dto";
import { queryParser } from "../../common/queryParse";
import { prisma } from "../../database";
import { authOnlyAdmin, authUser } from "../auth/authenticator";
import { UserInput } from "./input";
import { updateService, postService, deleteService, getOneService, getAllService } from "./service";
import { inputDto, outputDto } from "./transformer";

export const userRouter=express.Router()


userRouter.get('/',authOnlyAdmin, async(req:express.Request, res:express.Response)=>{
    try{
        let {_status:parsedQueryStatus,...parsedQuery}=queryParser(req.query) as any
        if(parsedQueryStatus){
            res.status(parsedQueryStatus).json({
                status:parsedQueryStatus,
                ...parsedQuery
            })
        }
        const {_status=200, ...result}=await dtoResolver(parsedQuery, {
            service:getAllService,
            transformers:{
                input: inputDto,
                output: outputDto
            },
            "context":"selectAll"
        })
        return res.status(_status).json({...result, status:_status})
    }catch(e){
        console.log(e)
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. Une erreur est survenue lors de l'exécution. Verifier à nouveau la requete."
        })
    }
})

userRouter.get('/:id',authUser, async (req:express.Request, res:express.Response)=>{
    const id=req.params.id
const select=queryParser(req.query)
if(id){
    const {_status=200, ...result}=await dtoResolver({id, ...(select?{...select}:{})}, {
        service:getOneService,
        transformers:{
            input: inputDto,
            output: outputDto
        },"context":"selectOne"
    })
    return res.status(_status).json({...result, status:_status})
}else{
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. La propriété `data` n'est pas définie"
        })
    }
})

userRouter.post('/', async (req:express.Request, res:express.Response)=>{
    const {data}=req.body
    if(data){
        const {_status=200, ...result}=await dtoResolver(data, {
            service:postService,
            transformers:{
                input: inputDto,
                output: outputDto
            },
            validateOnType: UserInput,
            context:"create",
            transformContext:"create"
        })
        return res.status(_status).json({...result, status:_status})
    }else{
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. La propriété `data` n'est pas définie"
        })
    }
    
})

userRouter.patch('/:id',authUser, async (req:express.Request, res:express.Response)=>{
    let {data}:any=req.body
    data['id']=req.params.id
    if(data){
        const oldData=await prisma.user.findUnique({
            where:{
                id:data.id
            }
        })
        if(oldData){
            if(((oldData.id === (req?.user as any)?.id) || (req?.user as any).currentRole.toLowerCase()==="admin") ){

                const {_status=200, ...result}=await dtoResolver(data, {
                    service:updateService,
                    transformers:{
                        input: inputDto,
                        output: outputDto
                    },
                    validateOnType: UserInput,
                    context:"update",
                    transformContext:"update"
                })
                return res.status(_status).json({...result, status:_status})
            }else{
                return res.status(403).json({
                    status:403,
                    message:"L'accès à cette resource vous a été refusé."
                })
            }
        }else{
            return res.status(403).json({
                status:403,
                message:"Ressource inexistante."
            })
        }
    }else{
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. La propriété `data` n'est pas définie"
        })
    }
})

userRouter.delete('/:id',authUser, async (req:express.Request, res:express.Response)=>{
    const {id}=req.params
    if(id){
        const oldData=await prisma.user.findUnique({
            where:{
                id
            }
        })
        if(oldData){
            if(((oldData.id === (req?.user as any)?.id) || (req?.user as any).currentRole.toLowerCase()==="admin") ){
                const {_status=200, ...result}=await dtoResolver({id}, {
                    service:deleteService,
                    transformers:{
                        input: inputDto,
                        output: outputDto
                    },
                    validateOnType: UserInput,
                    context:"delete"
                })
                return res.status(_status).json({...result, status:_status})
            }else{
                return res.status(403).json({
                    status:403,
                    message:"L'accès à cette resource vous a été refusé."
                })
            }
        }else{
            return res.status(403).json({
                status:403,
                message:"Ressource inexistante."
            })
        }
    }else{
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. La propriété `id` n'est pas définie"
        })
    }
})
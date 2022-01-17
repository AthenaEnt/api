import express from "express";
import { dtoResolver } from "../../common/dto";
import { queryParser } from "../../common/queryParse";
import { prisma } from "../../database";
import { UserShippingAdressInput } from "./input";
import { updateService, postService, deleteService, getOneService, getAllService } from "./service";
import { inputDto, outputDto } from "./transformer";

export const userShippingAdressRouter=express.Router()


userShippingAdressRouter.get('/', async(req:express.Request, res:express.Response)=>{
    try{
        let {_status:parsedQueryStatus,...parsedQuery}=queryParser(req.query) as any
        if(parsedQueryStatus){
            res.status(parsedQueryStatus).json({
                status:parsedQueryStatus,
                ...parsedQuery
            })
        }
        if(req.user){
            //@ts-ignore
            if(req.user.currentRole.toLowerCase()==="customer"){
                parsedQuery.where={
                    ...parsedQuery.where,
                    forUserId:{
                        equals:(req.user as any).id
                    }
                }
            }
        }else{
            res.status(400).json({
                status:400,
                message:"Mauvaise requete. Vous devez d'abors vous connecté."
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

userShippingAdressRouter.get('/:id', async (req:express.Request, res:express.Response)=>{
    const id=req.params.id
    const queryParserResult=queryParser(req.query)
    const select={
        ...queryParserResult,
        select:{
            ...(queryParserResult.select ?? {}),
            forUserId:true
        }
    }
    if(id){
        const {_status=200, ...result}=await dtoResolver({id, ...(select?{...select}:{})}, {
            service:getOneService,
            transformers:{
                input: inputDto,
                output: outputDto
            },"context":"selectOne"
        })
        if(!result.error){
            const {forUserId}=result.data
            if((req?.user as any)?.currentRole?.toLowerCase()==="customer" && (req?.user as any)?.id !== forUserId){
                return res.status(403).json({
                    status:403,
                    message:"L'accès à cette resource vous a été refusé."
                })
            }
        }
        return res.status(_status).json({...result, status:_status})
    }else{
            return res.status(400).json({
                status:400,
                message:"Mauvaise requete. La propriété `data` n'est pas définie"
            })
        }
})

userShippingAdressRouter.post('/', async (req:express.Request, res:express.Response)=>{
    const {data}=req.body
    if(data){
        const {_status=200, ...result}=await dtoResolver(data, {
            service:postService,
            transformers:{
                input: inputDto,
                output: outputDto
            },
            validateOnType: UserShippingAdressInput,
            context:"createUserShipping",
            transformContext:"createUserShipping"
        })
        return res.status(_status).json({...result, status:_status})
    }else{
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. La propriété `data` n'est pas définie"
        })
    }
    
})

userShippingAdressRouter.patch('/:id', async (req:express.Request, res:express.Response)=>{
    let {data}:any=req.body
    data['id']=req.params.id
    if(data){
        const oldData=await prisma.userShippingAdress.findUnique({
            where:{
                id:data.id
            }
        })
        if(oldData){
            if(((oldData.forUserId === (req?.user as any)?.id) || (req?.user as any).currentRole.toLowerCase()==="admin") ){

                const {_status=200, ...result}=await dtoResolver(data, {
                    service:updateService,
                    transformers:{
                        input: inputDto,
                        output: outputDto
                    },
                    validateOnType: UserShippingAdressInput,
                    context:"updateUserShipping"
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

userShippingAdressRouter.delete('/:id', async (req:express.Request, res:express.Response)=>{
    const {id}=req.params
    if(id){
        const oldData=await prisma.userShippingAdress.findUnique({
            where:{
                id
            }
        })
        if(oldData){
            if(((oldData.forUserId === (req?.user as any)?.id) || (req?.user as any).currentRole.toLowerCase()==="admin") ){
                const {_status=200, ...result}=await dtoResolver({id}, {
                    service:deleteService,
                    transformers:{
                        input: inputDto,
                        output: outputDto
                    },
                    validateOnType: UserShippingAdressInput,
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
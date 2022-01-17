import express from "express";
import { dtoResolver } from "../../common/dto";
import { queryParser } from "../../common/queryParse";
import { authOnlyAdmin } from "../auth/authenticator";
import { ShippingRuleInput } from "./input";
import { updateService, postService, deleteService, getOneService, getAllService } from "./service";
import { inputDto, outputDto } from "./transformer";

export const shippingRuleRouter=express.Router()


shippingRuleRouter.get('/', async(req:express.Request, res:express.Response)=>{
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
            },"context":"selectAll"
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

shippingRuleRouter.get('/:id', async (req:express.Request, res:express.Response)=>{
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

shippingRuleRouter.post('/',authOnlyAdmin, async (req:express.Request, res:express.Response)=>{
    const {data}=req.body
    if(data){
        const {_status=200, ...result}=await dtoResolver(data, {
            service:postService,
            transformers:{
                input: inputDto,
                output: outputDto
            },
            validateOnType: ShippingRuleInput,
            context:"create"
        })
        return res.status(_status).json({...result, status:_status})
    }else{
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. La propriété `data` n'est pas définie"
        })
    }
    
})

shippingRuleRouter.patch('/:id',authOnlyAdmin, async (req:express.Request, res:express.Response)=>{
    let {data}:any=req.body
    data['id']=req.params.id
    if(data){
        const {_status=200, ...result}=await dtoResolver(data, {
            service:updateService,
            transformers:{
                input: inputDto,
                output: outputDto
            },
            validateOnType: ShippingRuleInput,
            context:"update"
        })
        return res.status(_status).json({...result, status:_status})
    }else{
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. La propriété `data` n'est pas définie"
        })
    }
})

shippingRuleRouter.delete('/:id',authOnlyAdmin, async (req:express.Request, res:express.Response)=>{
    const {id}=req.params
    if(id){
        const {_status=200, ...result}=await dtoResolver({id}, {
            service:deleteService,
            transformers:{
                input: inputDto,
                output: outputDto
            },
            validateOnType: ShippingRuleInput,
            context:"delete"
        })
        return res.status(_status).json({...result, status:_status})
    }else{
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. La propriété `id` n'est pas définie"
        })
    }
})
import express from "express";
import { FedaPay, Transaction, Webhook } from "fedapay";
import { v4 } from "uuid"
import { dtoResolver } from "../../common/dto";
import { queryParser } from "../../common/queryParse";
import { prisma } from "../../database";
import { authUser } from "../auth/authenticator";
import { CommandInput } from "./input";
import { CommandModule } from "./module";
import { updateService, postService, deleteService, getOneService, getAllService } from "./service";
import { inputDto, outputDto } from "./transformer";


export const CommandRouter=express.Router()


CommandRouter.get('/',authUser, async(req:express.Request, res:express.Response)=>{
    
    
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
                    orderedById:{
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

CommandRouter.get('/:id',authUser, async (req:express.Request, res:express.Response)=>{
    const id=req.params.id
    const queryParserResult=queryParser(req.query)
    const select={
        ...queryParserResult,
        select:{
            ...(queryParserResult.select ?? {}),
            orderedById:true
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
            const {orderedById}=result.data
            if((req?.user as any)?.currentRole?.toLowerCase()==="customer" && (req?.user as any)?.id !== orderedById){
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

CommandRouter.post('/',authUser, async (req:express.Request, res:express.Response)=>{
    const {data}=req.body

    
    if(data){
        const {_status=200, ...result}=await dtoResolver(data, {
            service:postService,
            transformers:{
                input: inputDto,
                output: outputDto
            },
            validateOnType: CommandInput,
            context:"createCommand",
            transformContext:"createCommand",
            persist:req.query.hasOwnProperty('eval') ? false: true
        })
        return res.status(_status).json({...result, status:_status})
    }else{
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. La propriété `data` n'est pas définie"
        })
    }
    
})

CommandRouter.post('/pay',authUser, async (req:express.Request, res:express.Response)=>{
    try{
        const {data}=req.body//{commandId, phone, mode}console
    const usedPayments=await prisma.generalMeta.findMany({
        where:{
            key:{
                equals:"payment_gateway"
            }
        }
    }) 
    const usedPayment=await prisma.generalMeta.findFirst({
        where:{
            key:"used_payment_gateway"
        }
    })
    const paymentMethod=usedPayments.find((p)=>(p.value as any).provider_key===usedPayment.value)
    const command=await prisma.command.findUnique({
        where:{
            id:data.commandId
        },
        include:{
            receipt:true
        }
    })
    
    const user:any=req.user

    FedaPay.setApiKey((paymentMethod.value as any).provider_api_private_key);

    /* Précisez si vous souhaitez exécuter votre requête en mode test ou live */
    FedaPay.setEnvironment('live'); //ou setEnvironment('live');

    /* Créer la transaction console*/
    const transaction =await Transaction.create({
        description: 'Paiement achat sur app tokpa',
        amount: command.receipt.amount,
        //callback_url: 'https://maplateforme.com/callback',
        currency: {
            iso: 'XOF'
        },
        customer: {
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            phone_number: {
                number: data.phone,
                country: 'BJ'
            }
        }
    });
    const token = (await transaction.generateToken()).token;
    const mode = data.mode; // 'mtn', 'moov', 'mtn_ci', 'moov_tg'
    const paymentObj=await transaction.sendNowWithToken(mode, token)
    const result={
        ...transaction,
        ...paymentObj
    }
    const dd={
        id:command.id,
        receipt:{
            id:command.receipt.id,
            outPaymentId:result.id.toString(),
            outPaymentDetails:result
        }
    }
    const {_status, ...resultend}=await pathCommand(dd, req?.user)

    return res.status(_status).json({...resultend, status:_status})
    
    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"Erreur lors de l'envoie de la requete."
        })
    }
})

const pathCommand=async (data, user)=>{
    if(data){
        const oldData=await prisma.command.findUnique({
            where:{
                id:data.id
            }
        })
        if(oldData){
            if(((oldData.orderedById === (user as any)?.id) || (user as any).currentRole.toLowerCase()==="admin") ){

                const {_status=200, ...result}=await dtoResolver(data, {
                    service:updateService,
                    transformers:{
                        input: inputDto,
                        output: outputDto
                    },
                    validateOnType: CommandInput,
                    context:"updateCommand",
                    transformContext:"updateCommand"
                })
                return {_status, ...result}
            }else{
                return {_status:403, 
                    message:"L'accès à cette resource vous a été refusé."}
            }
        }else{
            return {_status:403, 
                message:"Ressource inexistante."}
        }
    }
}

CommandRouter.patch('/:id',authUser, async (req:express.Request, res:express.Response)=>{
    const {id}=req.params
    let {data}=req.body
    data['id']=id
    if(data){
       const result=await pathCommand(data, req?.user)
       const {_status, ...ress}=result
       return res.status(_status).json({...ress, status:_status})
    }else{
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. La propriété `data` n'est pas définie"
        })
    }
})

CommandRouter.delete('/:id',authUser, async (req:express.Request, res:express.Response)=>{
    const {id}=req.params
    if(id){
        const oldData=await prisma.command.findUnique({
            where:{
                id
            }
        })
        
        if(oldData){
            if(((oldData.orderedById === (req?.user as any)?.id) || (req?.user as any).currentRole.toLowerCase()==="admin") ){
                const {_status=200, ...result}=await dtoResolver({id}, {
                    service:deleteService,
                    transformers:{
                        input: inputDto,
                        output: outputDto
                    },
                    validateOnType: CommandInput,
                    context:"delete",
                    transformContext:"delete"
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


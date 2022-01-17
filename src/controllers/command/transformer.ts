import { prisma } from "../../database";
import { CreateManyNestedField, CreateOneNestedField, UpdateManyNestedField, UpdateOneNestedField } from "../fun";
import { CommandModule } from "./module";
import {v4} from "uuid"
import { Prisma } from "../../database/generated/client";;
import { NOTIFICATION_STATUS, NOTIFICATION_THEME } from "../../config/admin.config";

export const inputDto=async (data:any, context:string="create", persist)=>{
    //console.log(data)
    //Check if product in command are valid. product with type==="variant" are invalids
    if(['create', 'update'].includes(context)){
        if(data.commandProducts instanceof Array){
            for(let i = 0; i<data.commandProducts.length; i++){
                const product=await prisma.product.findUnique({
                    where:{
                        id:data.commandProducts[i].id
                    }
                })
                if(product.type.toLowerCase()==="variant"){
                    return {
                        _status:400,
                        message:"Certains produits sont invalides. Veillez choisir un produit valide. Ceci peut arriver lorsque vous essayer de commander un produit variable."
                    }
                }
            }
        }
    }
    const getCommandProductsById=async (command:any)=>{
        if(!Boolean(command.commandProducts?.length)){
            return command;
        }
        for(let i = 0; i<command.commandProducts.length; i++){
            const cp=command.commandProducts[i]
            command.commandProducts[i]={
                ...command.commandProducts[i],
                product:await prisma.product.findUnique({
                    where:{
                        id:command.commandProducts[i].product.id
                    }
                }),
                commandUnitProduct:await prisma.commandUnitProduct.findUnique({
                    where:{
                        id:command.commandProducts[i].commandUnitProduct.id
                    },
                    include:{
                        commandUnit:true
                    }
                })
            }
        }
        return command
    }
    const getCommandUserShippingAdress=async (command:any)=>{
        if(!Boolean(command.shippingAdress)){
            return command
        }
        return {
            ...command,
            shippingAdress:await prisma.userShippingAdress.findUnique({
                where:{
                    id:command.shippingAdress.id
                },
                include:{
                    shippingZone:true
                }
            })
        }
    }
    switch(context){
        case 'createCommand':{
            const user=await prisma.user.findUnique({
                where:{
                    id:data.orderedBy?.id
                },
                include:{
                    commands:true
                }
            })
            //Unlink object convertion
            try{
                data["orderId"]=(new Date()).getTime()
                data['orderedBy']=user
                const usableCommand=await getCommandUserShippingAdress(await getCommandProductsById(JSON.parse(JSON.stringify(data))))
                const receipt=await CommandModule.getReceipt({...usableCommand}, persist)

                //Notifications
                const notification=user.commands.length ? {
                    id:v4(),
                    title:"Nouvelle Commande",
                    context:NOTIFICATION_STATUS.newCommand,
                    content:"Une nouvelle commande ajouté pour vous.",
                    userId:data.orderedBy.id,
                    theme:'success',
                } : {
                    id:v4(),
                    title:"Nouvelle Commande",
                    context:NOTIFICATION_STATUS.newCommand,
                    userId:data.orderedBy.id,
                    theme:NOTIFICATION_THEME.success,
                    content:"Félicitaton! Vous avez enrégistrer votre première command sur Tokpa."
                }
                
                return {
                    
                    ...data,
                    id:v4(),
                    orderedBy:CreateOneNestedField(data.orderedBy,"connect"),
                    shippingAdress:CreateOneNestedField(data.shippingAdress,"connect"),
                    totalPrice: await CommandModule.evalCommandAmount(usableCommand),
                    status:NOTIFICATION_STATUS.commandPaymentPending,
                    commandProducts:CreateManyNestedField(data.commandProducts.map((c)=>({
                        id:v4(),
                        ...c,
                        product:CreateOneNestedField(c.product, "connect"),
                        commandUnitProduct:CreateOneNestedField(c.commandUnitProduct, "connect")
                    })), "create"),
                    ...(data.appliedDiscount ? {appliedDiscount: CreateOneNestedField(data.appliedDiscount,"connect")}:{} ),
                    receipt:{
                        create: {
                            ...receipt,
                            id:v4(),
                        }
                    },
                    notifications:CreateManyNestedField([notification], "create")
                } 
            }catch(e){
                console.log(e)
                return{
                    _status:400,
                    message:e.message,
                    details:e
                }
            }
            
        }
        case 'updateCommand':{
            try{
                let {receipt:sentReceipt, ...datas}=data
                Object.keys(datas).forEach((d:any)=>{
                    if(datas[d]===undefined){
                        delete datas[d];
                    }
                })
                const {shippingAdressId, orderedById, appliedDiscountId,receiptId,orderedBy,appliedDiscount, ...command} = await prisma.command.findUnique({
                    where:{
                        id:data.id
                    },
                    include:{
                        shippingAdress:{
                            include:{
                                shippingZone:true
                            }
                        },
                        orderedBy:true,
                        appliedDiscount:true,
                        commandProducts:{
                            include:{
                                product:true,
                                commandUnitProduct:true
                            }
                        }
                    }
                })
                const dat={
                    ...command,
                    ...datas
                }
                const {discount, ...d}=dat
                const receipt={...sentReceipt, ...(await CommandModule.getReceipt({...dat, orderedBy,}))}
                const updateData={
                    ...d,
                    
                    //...(d.appliedDiscount ?{appliedDiscount: UpdateOneNestedField({id:d.appliedDiscount.id},"connect")}:{} ),
                    totalPrice: await CommandModule.evalCommandAmount(dat),
                    receipt:{
                        update: receipt
                    },
                    //orderedBy:CreateOneNestedField(d.orderedBy,"connect"),
                    ...(d.shippingAdress ? {
                        shippingAdress:UpdateOneNestedField({id:d.shippingAdress.id},"connect"),
                    }:{}),
                    ...(d.commandProducts ?{
                        commandProducts:UpdateManyNestedField(d.commandProducts.map(({productId, commandId,commandUnitProductId,...c})=>({
                            ...c,
                            product:UpdateOneNestedField({id:c.product.id}, "connect"),
                            commandUnitProduct:UpdateOneNestedField({id:c.commandUnitProduct.id}, "connect")
                        })), [
                            {
                                action:"create",
                                filter:(data:any)=>data.filter((m:any)=>!Boolean(m.id))
                            },
                            {
                                action:"delete",
                                filter:(data:any)=>command.commandProducts ? command.commandProducts.filter((me)=>!Boolean(data.find((d:any)=>d.id===me.id))) : []
                            },
                            {
                                action:"update",
                                filter:(data:any)=>command.commandProducts ? data.filter((m:any)=>m.id && Boolean(command.commandProducts.find((me)=>me.id===m.id))) : []
                            }
                        ])
                    }:{})
                }
                
                return {
                    ...updateData,
                    
                }
            }catch(e){
                console.log(e)
                return{
                    _status:400,
                    message:e.message,
                    details:e
                }
            }
        }
        default:
            return data;
    }
}

export const outputDto=(data:any, context:string="create")=>{
    switch(context){
        case "create":
            return data
        default:
            return data;
    }
}
import { prisma } from "../../database";
import { ruleParse } from "../shippingRule/input"
import { Command } from "../../database/generated/client";
import PDFDocument from "pdfkit"
import fs from "fs"
import {v4} from "uuid"
import Twig from "twig"
import FormData from "form-data"
import { SOURCE_MEDIA } from "../../config/admin.config";
import { CreateOneNestedField } from "../fun";
import HtmlToPdf from "html-pdf-node"


export module CommandModule{
    export const formatCommand=async (command:any):Promise<Command>=>{
        command.orderedBy=await prisma.user.findUnique({
            where:{
                id:command.orderedBy.id
            }
        })
        command.shippingAdress=await prisma.userShippingAdress.findUnique({
            where:{
                id:command.shippingAdress.id
            },
            include:{
                shippingZone:true
            }
        })
        if(command.appliedDiscount){
            command.appliedDiscount=await prisma.discount.findUnique({
                where:{
                    id:command.appliedDiscount.id
                }
            })
        }
        
        for(let i = 0; i<command.commandProducts.length; i++){
            command.commandProducts[i]={
                ...command.commandProducts[i],
                product:await prisma.product.findUnique({
                    where:{
                        id:command.commandProducts[i].product.id
                    },
                    include:{
                        discounts:true, 
                        variantParent:{
                            include:{
                                commandUnitProducts:{
                                    include:{
                                        commandUnit:true
                                    }
                                }
                            }
                        },
                        commandUnitProducts:{
                            include:{
                                commandUnit:true
                            }
                        }
                    }
                }),
                commandUnitProduct:await prisma.commandUnitProduct.findUnique({
                    where:{
                        id:command.commandProducts[i].commandUnitProduct.id
                    }
                })
            }
        }
        
        return command;
    }
    

    const evalCommandWeight=(command:any)=>{
        const v=command.commandProducts.filter((c)=>Boolean(c.product.productWeight)).map((c:any)=>c.product.productWeight * c.quantite)
        return v.length ? v.reduce((c,p)=>c+p) : false
    }

    const evalShippingCommandWeightCost=async({commandWeight, baseShippingPrice})=>{
        let costs=[]
        const rules=await prisma.shippingRule.findMany()
        //commandWeight unknow so it is not considered
        if(!commandWeight){
            return {
                baseShippingPrice,
                status:"default",
                rule:null,
                amount:baseShippingPrice
            }
        }
        if(rules && rules.length){
            const params=[
                {
                    tag:"{{command_weight}}",
                    value:commandWeight
                }
            ]
            costs=rules.map(r=>{
                let ruleParsed=ruleParse(r.rule as any)
                params.forEach((p)=>{
                    ruleParsed.eval=ruleParsed.eval.replace(new RegExp(p.tag,"g"), p.value)
                    ruleParsed.cond=ruleParsed.cond.replace(new RegExp(p.tag,"g"), p.value)
                    
                })
                return {
                    baseShippingPrice,
                    status:"applied",
                    rule:r,
                    valid:eval(ruleParsed.cond.replace(new RegExp('{{base_shipping_price}}', "g"), baseShippingPrice)),
                    amount:eval(ruleParsed.eval.replace(new RegExp('{{base_shipping_price}}', "g"), baseShippingPrice))
                }
            })
            const valids=costs.filter((c:any)=>c.valid)
            if(valids.length){
                const strategy=await prisma.generalMeta.findFirst({
                    where:{
                        key:{
                            equals:"shipping_rule_application"
                        }
                    }
                })
                
                if(strategy){
                    switch(strategy.value){
                        case"last_valid":{
                            return valids[valids.length - 1]
                        }
                    
                        case "much_expensive":{
                            return valids.sort((a, b)=>b.amount - a.amount)[0]
                        }
                        
                        case "less_expensive":{
                            return valids.sort((a, b)=>a.amount - b.amount)[0]
                        }
                        default:{
                            return valids[0]
                        }
                    }
                }else{
                    return {
                        baseShippingPrice,
                        status:"default",
                        rule:null,
                        amount:baseShippingPrice
                    }
                }
            }
        }
        throw new Error('Aucune règle de calcul du cout de la livraison définie prenant en charge cette livraison. L\'oération en cours ne peut poursuivre.')
    }
    export const evalCommandAmount=async(command:any)=>{
        let totalCommandAmout=0
        for(let i = 0; i<command.commandProducts?.length; i++){
            let cp=command.commandProducts[i]
            totalCommandAmout=totalCommandAmout+(cp.commandUnitProduct.unitPrice * cp.quantite)
        }
        return totalCommandAmout
    }

    export const evalDiscount=async (command:any)=>{
        if(Boolean(command?.appliedDiscount)){
            //Get dicount
            command['discount']=command.appliedDiscount
            //check if discount valid
            const now=new Date();

            if((command['discount'] && now>=command['discount'].startAt && now<= command['discount'].endAt)){
                const commandProducts=command.commandProducts
                const evalAmount=(commandProducts:any, discountValue:number, discountType:string)=>{
                    const discountProducts=commandProducts.map((cp:any)=>{
                        const baseUsedPrice=cp.commandUnitProduct.unitPrice
                        //Discount application details
                        return {
                            productId:cp.product.id,
                            baseUsedPrice,
                            quantite:cp.quantite,
                            //hasUsedOnSalePrice:baseUsedPrice==cp.product.regularPrice
                        }
                    })
                    const totalPrice:number=discountProducts.map((d:any)=>d.baseUsedPrice * d.quantite).reduce((c:number, p:number)=>c+p)
                    
                    if(discountType==="percent"){
                        return {
                            products:discountProducts,
                            discountAmount:totalPrice * (discountValue/100)
                        }
                    }
                    return {
                        products:discountProducts,
                        discountAmount:discountValue
                    }
                }
                if(commandProducts.length){
                    const totalQte:number=commandProducts.map((cp:any)=>cp.quantite).reduce((c:number, p:number)=>c+p)
                    const totalCommandAmout=await evalCommandAmount(command)
                    //console.log(command, totalQte, totalCommandAmout)
                    const {
                        inCartProductMin,
                        inCartProductMax,
                        commandAmountMin,
                        commandAmountMax,
                    } = command['discount']

                    let inCartValid=true
                    if(inCartProductMin!==undefined){
                        inCartValid =inCartValid && totalQte>=inCartProductMin
                        if(inCartProductMax!==undefined && inCartValid){
                            inCartValid =inCartValid && totalQte<=inCartProductMax
                        }
                    }
                    if(commandAmountMin!==undefined){
                        inCartValid =inCartValid && totalCommandAmout>=commandAmountMin
                        if(commandAmountMax!==undefined && inCartValid){
                            inCartValid =inCartValid && totalCommandAmout<=commandAmountMax
                        }
                    }
                    if(inCartValid){
                        return evalAmount(commandProducts, command['discount'].discount, command['discount'].discountType)
                    }
                }else{
                    return {
                        products:[],
                        discountAmount:0
                    }
                }
            }else{
                throw new Error("Réduction non valide. Il se pourrait qu'elle s'est déjà terminée ou expirée.")
            }
        }
        return false
    }

    export const getReceipt=async (command:any, persist=false)=>{
        const userShippingZone=command.shippingAdress
        if(userShippingZone){
            try{
                const commandWeight= evalCommandWeight(command)
                const shippingCost=await evalShippingCommandWeightCost({commandWeight, baseShippingPrice: userShippingZone.shippingZone.baseShippingPrice})
                //disable discount for now
                //const discountCost=0//await evalDiscount(command)
                const totalAmount=await evalCommandAmount(command)
                const transactionFees=await prisma.generalMeta.findFirst({
                    where:{
                        key:{
                            equals:"transaction_fees"
                        }
                    }
                })
                
                let receiptPrice=(totalAmount  + shippingCost.amount)
                receiptPrice=Math.ceil((receiptPrice*(1+(Number(transactionFees.value)/100))))
                const d={
                    amount:receiptPrice,
                    receiptMetas:{
                        transaction_fees:transactionFees.value,
                        shipping:shippingCost,
                        productsTotalAmount:totalAmount,
                    }
                }
                const time=new Date()
                const createdAt=`${time.getDay() < 10 ?"0"+time.getDay():time.getDay() }/${(time.getMonth()+1) < 10 ? "0"+(time.getMonth()+1) : (time.getMonth()+1) }/${time.getFullYear()} ${time.getHours()  < 10 ? "0"+time.getHours() : time.getHours()  }:${time.getMinutes() < 10 ? "0"+time.getMinutes() : time.getMinutes()  }`
                let receiptMedia={}
                //console.log(persist)
                if(persist){
                    const invoice=await generateInvoicePDF({...command,createdAt, receipt:d})
                    receiptMedia=persist ? {
                        receiptMedia:CreateOneNestedField({id:invoice.id} ,"connect")
                    }:{}
                }
                return{
                    ...d, 
                    ...receiptMedia
                }
            }catch(e){
                console.log(e)
            }
        }else{
            throw new Error('Zone de livraison non supportée actuellement.')
        }
        
    }

    export const generateInvoicePDF=async (command,)=>{
        const createInvoice=async ({command, detail}, path)=>{
            return new Promise((res, rej)=>{
                const image=fs.readFileSync('public/assets/logo.png', {encoding:"base64"})
                Twig.renderFile('src/views/invoice.html.twig',{
                    detail,
                    command,
                    logo:"data:image/png;base64,"+image 
                } as any , (err, html) => {
                    if(err){
                        rej(err)
                    }else{
                        fs.writeFileSync(path, html)
                        res(html)
                    }
                });
            })
        }
        const companyDetails=await prisma.generalMeta.findFirst({
            where:{
                key:{
                    equals:"company_details"
                }
            }
        })
        const transactionFees=await prisma.generalMeta.findFirst({
            where:{
                key:"transaction_fees"
            }
        })
        const file=command.orderedBy.id+(new Date()).getTime()+".html"
        const filename="/gen/commands/receipt-"+file
        await createInvoice({
            command, 
            detail:{
                ...(Boolean(companyDetails?.value) ?companyDetails?.value as object: {}),
                transaction_fees:transactionFees?.value
            }}, 
            "public/"+filename
        )
        const media=await prisma.media.create({
            data:{
                id:v4(),
                fileType:"text/html",
                filename:file,
                source:SOURCE_MEDIA.server,
                path:filename
            }
        })
        return media
        
    }

    export const generateInvoicePDFS=async (command)=>{
       
        const createInvoice=async ({command, detail}, path)=>{
            return new Promise((res, rej)=>{
                let doc = new PDFDocument({ margin: 50 });
                const image=fs.readFileSync('public/assets/logo.png', {encoding:"base64"})
                Twig.renderFile('src/views/invoice.html.twig',{
                    detail,
                    command,
                    logo:"data:image/png;base64,"+image
                } as any , (err, html) => {
                    if(err){
                        rej(err)
                    }else{
                        fs.writeFileSync('public/gen/index.html', html)
                        HtmlToPdf.generatePdf({content:html}, {format:"A4"}).then((pdfBuffer)=>{
                           fs.createWriteStream(path).write(pdfBuffer)
                           res(path)
                        }).catch((e)=> {
                            rej(e)
                        })
                    }
                });
            })
        }
        const companyDetails=await prisma.generalMeta.findFirst({
            where:{
                key:{
                    equals:"company_details"
                }
            }
        })
        const transactionFees=await prisma.generalMeta.findFirst({
            where:{
                key:"transaction_fees"
            }
        })
        await createInvoice({
            command, 
            detail:{
                ...(Boolean(companyDetails?.value) ?companyDetails?.value as object: {}),
                transaction_fees:transactionFees?.value
            }}, "public/gen/receipt-"+command.orderedBy.id+(new Date()).getTime()+".pdf")
    }



















    

    

}
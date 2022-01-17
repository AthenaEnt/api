import express from "express";
import { FedaPay, Transaction } from "fedapay";
import { NOTIFICATION_STATUS, NOTIFICATION_THEME, SOCKET_KEYS } from"../../config/admin.config";
import { prisma } from "../../database";
import { CreateOneNestedField, UpdateManyNestedField } from "../fun";
import { v4 } from "uuid"
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AuthenticatorModule } from "../../services/authenticator.module";
import { decodeUser, getUser } from "../auth/authenticator";
import { CommandModule } from "../command/module";
import { SmsMailer } from "../../services/mailer.module";
import fs from "fs"


export const webhookRouter=express.Router()

export let SOCKETS_CONNECT:Array<{socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, user:any}>=[]

webhookRouter.post('/commands', async (req, res)=>{
    const sig = req.headers['x-fedapay-signature'];
    try{
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
        if(paymentMethod){
            //event = Webhook.constructEvent(req.body, sig, endpointSecret);
            const pendingCommands=await prisma.command.findMany({
                where:{
                    status:{
                        in:[NOTIFICATION_STATUS.commandPaymentPending/*, NOTIFICATION_STATUS.commandPaymentFailed*/]
                    }
                },
                include:{
                    receipt:true,
                    orderedBy:true
                }
            })
            /* Remplacez VOTRE_CLE_API par votre véritable clé API */
            FedaPay.setApiKey((paymentMethod.value as any).provider_api_private_key);
            /* Précisez si vous souhaitez exécuter votre requête en mode test ou live */
            FedaPay.setEnvironment('live'); //ou setEnvironment('live');
            let userData=[]
            for(let i in pendingCommands){
                if(pendingCommands[i].receipt.outPaymentId){
                    const transaction=await Transaction.retrieve(pendingCommands[i].receipt.outPaymentId)
                    if(["declined", "canceled"].includes(transaction.status)){
                        await prisma.command.update({
                            data:{
                                status:NOTIFICATION_STATUS.commandPaymentFailed,
                                receipt:{
                                    update:{
                                        isPaid:false,
                                        outPaymentDetails:{
                                            ...transaction,
                                            paymentFailureReasonText:transaction.status==="declined" ? "L'opération a été annuler ou refuser par le titulaire du compte.":"L'opération a été annulée. Veillez vérifier que vous avez les fonds disponible pour effectuer cette commande."
                                        }
                                    }
                                },
                                notifications:UpdateManyNestedField([{
                                    id:v4(),
                                    title:"Paiement de commande échoué.",
                                    priority:10,
                                    canLockScreen:true,
                                    context:NOTIFICATION_STATUS.commandPaymentFailed,
                                    content:"Le paiement de votre commande a échoué.",
                                    theme:NOTIFICATION_THEME.danger,
                                    user:CreateOneNestedField(pendingCommands[i].orderedBy, "connect")
                                }], "create")
                            },
                            where:{
                                id:pendingCommands[i].id
                            }
                        })
                        userData=Array.from(new Set([...userData, pendingCommands[i].orderedById]))
                    }else if(transaction.status==="approved"){
                        const comd=await prisma.command.update({
                            data:{
                                status:NOTIFICATION_STATUS.commandPaymentSucceed,
                                receipt:{
                                    update:{
                                        isPaid:true,
                                        outPaymentDetails:transaction
                                    }
                                },
                                notifications:UpdateManyNestedField([{
                                    id:v4(),
                                    priority:10,
                                    title:"Paiement de commande réussi.",
                                    canLockScreen:true,
                                    theme:NOTIFICATION_THEME.success,
                                    context:NOTIFICATION_STATUS.commandPaymentSucceed,
                                    user:CreateOneNestedField(pendingCommands[i].orderedBy, "connect"),
                                    content:"Le paiement de votre commande a bien été reçu. Votre commande est maintenant en cours de livraison."
                                }], "create")   
                            },
                            where:{
                                id:pendingCommands[i].id
                            },
                            include:{
                                receipt:{
                                    include:{
                                        receiptMedia:true
                                    }
                                }
                            }
                        })
                        
                        try{
                            const companyDetails=await prisma.generalMeta.findFirst({
                                where:{
                                    key:{
                                        equals:"company_details"
                                    }
                                }
                            })
                            const receiptData=fs.readFileSync('public'+comd.receipt.receiptMedia.path)
                            await SmsMailer.sendSmsWithD7Network((companyDetails.value as any).company_email, receiptData.toString())
                            console.log("email sent")
                        }catch(e){
                            console.log("email sent failed")
                            console.log(e)
                        }
                        
                        userData=Array.from(new Set([...userData, pendingCommands[i].orderedById]))
                    }
                }
            }
            if(SOCKETS_CONNECT.length){
                for(let i in userData){
                    const s=SOCKETS_CONNECT.find(({user})=>user.id===userData[i])
                    const userReloadedData=await getUser(userData[i])
                    console.log(userReloadedData)
                    s.socket.volatile.emit(SOCKET_KEYS.reload_user, userReloadedData)
                }
                
            }
        }
        return res.status(200).json({
            status:200,
            message:"Fait"
        })
    }catch(e){console.log(e)
        return res.status(400).json({
            status:400,
            message:"Mauvaise requete. Une erreur est survenue"
        })
    }
    
})

export async function setSocketConnection(socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>){
    const access_token=AuthenticatorModule.extractToken(socket.handshake)
    let user=undefined;
    if(access_token){
        try{
            user=await decodeUser(access_token)
            if(user){
                const n=typeof SOCKETS_CONNECT==="object" && SOCKETS_CONNECT.length ? SOCKETS_CONNECT.filter(({user:u})=>u.id!==user.id):SOCKETS_CONNECT
                SOCKETS_CONNECT=n ?? []
                SOCKETS_CONNECT.push({socket, user})
                console.log('user has connected')
            }
        }catch(e){

        }
        
    }
    socket.on('disconnect', ()=>{
        SOCKETS_CONNECT=Boolean(SOCKETS_CONNECT) &&  Boolean(SOCKETS_CONNECT.length) ?  SOCKETS_CONNECT.filter(({user:u})=>u.id!==user.id) :[]
        console.log('user has disconnected')
    })
}
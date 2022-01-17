import { prisma } from "../database";
import twilio from "twilio";
import sgMail, { MailDataRequired } from "@sendgrid/mail"
import S from "string"
import axios from "axios";

export module SmsMailer{
    export const sendSmsWithTwilio=async (to:string, message:string)=>{
        // Download the helper library from https://www.twilio.com/docs/node/install
        // Find your Account SID and Auth Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure

        const gateways=await prisma.generalMeta.findMany({
            where:{
                key:{
                    equals:"sms_gateway"
                }
            }
        })
        const twilioMeta=gateways.find((g)=>(g.value as any).provider_key==="twilio_sms")
        if(twilioMeta){
            //Default use twillio provider
            const companyNumber=await prisma.generalMeta.findFirst({
                where:{
                    key:{
                        equals:"sms_sender_phone_number"
                    }
                }
            })

            const accountSid = (twilioMeta.value as any).provider_api_secret_key
            const authToken = (twilioMeta.value as any).provider_auth_token
            const client = twilio(accountSid, authToken);

            const messageSent=await client.messages.create({
                body: message,
                from: companyNumber.value.toString(),
                to
            })
            if(messageSent.sid){
                return {
                    _status:200,
                    message:"SmS envoyé avec succès au "+to,
                    details:messageSent
                }
            }else{
                throw new Error(JSON.stringify({
                    _status:400,
                    message:"Une erreur est survenue lors de l'envoi du mésage au "+to,
                    details:messageSent
                }))
            }
        }else{
            throw new Error(JSON.stringify({
                _status:400,
                message:'Aucune configuration définie pour Twilio SMS. Envoie de message par twilio échoué.',
            }))
        }

    }

    export const sendSmsWithD7Network=async (to:string, message:string)=>{

        const gateways=await prisma.generalMeta.findMany({
            where:{
                key:{
                    equals:"sms_gateway"
                }
            }
        })
        const d7Meta=gateways.find((g)=>(g.value as any).provider_key==="d7network")
        if(d7Meta){
            //Default use twillio provider
            const companyName=await prisma.generalMeta.findFirst({
                where:{
                    key:{
                        equals:"sms_sender_phone_number_name"
                    }
                }
            })

            axios.defaults.headers.common.Authorization = `Bearer ${(d7Meta.value as any).provider_auth_token}`
            try{
                await axios.post('https://rest-api.d7networks.com/secure/send', {
                    to:to,
                    content:message,
                    from:companyName.value
                })
                return {
                    _status:200,
                    message:"SmS envoyé avec succès au "+to
                }
           }catch(e){
                throw new Error(JSON.stringify({
                    _status:400,
                    message:"Une erreur est survenue lors de l'envoi du méssage au "+to,
                    details:e
                }))
           }
        }else{
            throw new Error(JSON.stringify({
                _status:400,
                message:'Aucune configuration définie pour Twilio SMS. Envoie de message par twilio échoué.',
            }))
        }

    }

    export const sendSms=async(to:string, message:string)=>{
        try{
            const smsPrefered=await prisma.generalMeta.findFirst({
                where:{
                    key:{
                        equals:"used_sms_gateway"
                    }
                }
            })
            switch(smsPrefered.value){
                case"d7network":{
                    await sendSmsWithD7Network(to, message)
                    break;
                }
                default:
                    throw new Error(JSON.stringify({
                        _status:400,
                        message:'Aucune methode préférée sélectionnée.',
                    }))
            }
        
        }catch(e){

        }
    }
}

export module EmailMailer{
    export const sendEmailWithTwillio=async (to:string,subject:string, messageHtml:string)=>{
        
        const gateways=await prisma.generalMeta.findMany({
            where:{
                key:{
                    equals:"email_gateway"
                }
            }
        })
        const twilioMeta=gateways.find((g)=>(g.value as any).provider_key==="twilio_email")
        
        if(twilioMeta){
            //Default use twillio provider
            const companyEmailAdress=await prisma.generalMeta.findFirst({
                where:{
                    key:{
                        equals:"email_sender_email_adress"
                    }
                }
            })

            sgMail.setApiKey((twilioMeta.value as any).provider_api_key)
            
            const msg:MailDataRequired={
                to,
                from:companyEmailAdress.value.toString(),
                subject,
                text:S(messageHtml).stripTags().s,
                html:messageHtml
            }

            const messageSent=await sgMail.send(msg)
            if(messageSent[0].statusCode>=200 && messageSent[0].statusCode<=202){
                return {
                    _status:200,
                    message:"Email envoyé avec succès au "+to,
                    details:messageSent
                }
            }else{
                throw new Error(JSON.stringify({
                    _status:400,
                    message:"Une erreur est survenue lors de l'envoi du mésage au "+to,
                    details:messageSent
                }))
            }
        }else{
            throw new Error(JSON.stringify({
                _status:400,
                message:'Aucune configuration définie pour Twilio Email. Envoie de message par twilio échoué.',
            }))
        }
    }
}
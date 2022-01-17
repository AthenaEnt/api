import * as express from "express"
import * as jwt from "jsonwebtoken"
import { prisma } from "../database";
import { compareSync, genSaltSync, hashSync } from "bcrypt"


export module AuthenticatorModule{
    const AUTH_ERROR_MESSAGES={
        WRONG_PWD:"Mot de passe invalide",
        WRONG_EMAIL:"Email invalide, Compte non existant.",
        WRONG_TEL:"Téléphone invalide, Compte non existant.",
        UNKNOWN_ERROR:"Oops! Une erreur est survenue. Veillez réessayer de vous connecter à nouveau."
    }

    export const Roles={
        ADMIN:"admin",
        CUSTOMER:"customer"
    }

    
    export function getRequestIpAdress(req:express.Request){
        return (req.headers['x-forwarded-for'] as string)?.split(',').shift() || req?.socket?.remoteAddress || req?.connection?.remoteAddress || ""
    }
    
    export function checkToken(token:string, type:string):Promise<false|{user:any, ip:string}>{
        return new Promise((res, rej)=>{
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode)=>{
                
                if(err){
                    return res(false);
                }else{
                    if(decode){
                        const {type:decodedType, ...decoded}=decode
                        if(decodedType===type){
                            //console.log(Date.now().toString() , new Date(decoded.exp * 1000).toString(),Date.now() < (decoded.exp * 1000))
                            if(Date.now() < (decoded.exp * 1000)){
                                return res(decoded as {user:any, ip:string})
                            }
                        }
                    }
                    
                    return res(false); 
                }
            })
        })
    }
    
    export function createTokens(user:any, req:any){
        const accessTokenExpiresIn=process.env.JWT_AUTH_TOKEN_EXPIRE_DURATION
        const refreshTokenExpiresIn=process.env.JWT_REFRESH_TOKEN_EXPIRE_DURATION
        const auth={
            access_token:jwt.sign({user, type:"access_token"}, process.env.JWT_SECRET_KEY, {expiresIn:accessTokenExpiresIn}),
            refresh_token:jwt.sign({user,type:"refresh_token", ip:getRequestIpAdress(req)}, process.env.JWT_SECRET_KEY, {expiresIn:refreshTokenExpiresIn})
        }
        return auth
    }

    export function extractToken(req:any){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0]==="Bearer"){
            return req.headers.authorization.split(' ')[1]
        }else if(req.query?.access_token){
            return req.query.access_token
        }else if(req.body?.access_token){
            return req.body.access_token
        }
        return null
    }
    
    export function userRoleSwitcher(role:string, swithRole:string){
        if(role.toLowerCase()==="admin" && ["admin", "customer"].includes(swithRole.toLowerCase())){
            return true
        }else if(role.toLowerCase()==="customer"){
            if(swithRole.toLowerCase()==="customer"){
                return true
            }else{
                return false
            }
        }
        return false
    }

    export async function findUserWithEmail(email){
        return await prisma.user.findFirst({
            where:{
                email:{
                    equals:email
                }
            },
            include:{
                shippingAdress:{
                    include:{
                        shippingZone:true,
                        audioFile:true,
                    }
                },
                commands:{
                    include:{
                        receipt:{
                            include:{
                                receiptMedia:true
                            }
                        },
                        shippingAdress:true,
                        commandProducts:{
                            include:{
                                commandUnitProduct:true,
                                product:{
                                    include:{
                                        variantParent:true,
                                        medias:true
                                    }
                                }
                            }
                        }
                    }
                },
                profileImage:true
            }
        })
    }
    
    export async function findUserWithTel(tel){
        const commandSelect={
            include:{
                receipt:{
                    include:{
                        receiptMedia:true
                    }
                },
                shippingAdress:true,
                commandProducts:{
                    include:{
                        commandUnitProduct:true,
                        product:{
                            include:{
                                variantParent:true,
                                medias:true
                            }
                        }
                    }
                }
            }
        }
        return await prisma.user.findFirst({
            where:{
                phone:{
                    equals:tel
                }
            },
            include:{
                shippingAdress:{
                    include:{
                        shippingZone:true,
                        audioFile:true,
                    }
                },
                notifications:{
                    include:{
                        command:commandSelect,
                    }
                },
                commands:commandSelect,
                profileImage:true
            }
        })
    }
    
    export async function emailLogin(email:string, password:string):Promise<any|string>{
        try{
            const user=await findUserWithEmail(email)
            if(user){
                if(compareSync(password, user.passwordHash)){
                    return user
                }else{
                    return AUTH_ERROR_MESSAGES.WRONG_PWD
                }
            }else{
                return AUTH_ERROR_MESSAGES.WRONG_EMAIL
            }
        }catch(e){
            console.log(e)
            return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
        }
    }
    
    export async function telLogin(tel:string, password:string):Promise<any |string> {
        try{
            const user=await findUserWithTel(tel)
            if(user){
                if(compareSync(password, user.passwordHash)){
                    return user
                }else{
                    return AUTH_ERROR_MESSAGES.WRONG_PWD
                }
            }else{
                return AUTH_ERROR_MESSAGES.WRONG_TEL
            }
        }catch(e){
            console.log(e)
            return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
        }
    }
    
    export async function login(credential:string, password:string, type:"email"|"tel"="tel"):Promise<{
        status:400|200
        message:string
        user:any|null
    }>{
        let result:any="Option de connexion invalide";
        if(type==="tel"){
            result= await telLogin(credential, password)
        }else{
            result= await emailLogin(credential, password)
        }
        if(typeof result ==="string"){
            return {
                status:400,
                message:result,
                user:null
            }
        }else{
            return {
                status:200,
                message:"Connexion effectuée avec succès",
                user:result
            }
        }
    }

    export const isUser=(role:string, user:any)=>{
        return Boolean(user?.currentRole?.toLowerCase()===role.toLowerCase())
    }

    export const isUserAdmin=(req:any)=>{
        return isUser("admin", req.user)
    }

    export const isUserCustomer=(req:any)=>{
        return isUser("customer", req.user)
    }

    export const hashPassword=(password:string)=>{
        const saltRount=10;
        const salt=genSaltSync(saltRount)
        return hashSync(password, salt);
    }
}
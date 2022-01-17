import { isEmail, isPhoneNumber } from "class-validator"
import * as express from "express"
import { AuthenticatorModule } from "../../services/authenticator.module"
import { prisma } from "../../database"
import { EmailMailer, SmsMailer } from "../../services/mailer.module"
import { v4 } from "uuid"
import otp from "otp-generator"
import { compareSync } from "bcrypt"
//prisma
//Auth router endpoints
const authRouter=express.Router()

authRouter.post('/login',async  (req:express.Request, res:express.Response)=>{
    const {email, tel, password, role}=req.body
    
    if((email || tel) && (isEmail(email) || isPhoneNumber(tel, "BJ")) && password && role){
        
        let {user,...result}=await AuthenticatorModule.login(email ? email : tel, password, email ? "email":"tel")
        if(user){
            if(role) {
                if(AuthenticatorModule.userRoleSwitcher(user.role, role)){
                    try{
                        user={
                            ...(await prisma.user.update({
                                where:{
                                    id:user.id
                                },
                                data:{
                                    currentRole:role.toUpperCase()
                                }
                            })),
                            ...user
                        }
                    }catch(e){
                        console.log(e)
                        return res.json({
                            name:"Error",
                            status:400,
                            message:"Une erreur est surveneue"
                        })
                    }
                    
                }else{
                    return res.json({
                        name:"BadUserRoleError",
                        status:400,
                        message:"Role de connexion invalide"
                    })
                }
            }else{
                
                try{
                    user={
                        ...(await prisma.user.update({
                            where:{
                                id:user.id
                            },
                            data:{
                                currentRole:role.toUpperCase()
                            }
                        })),
                        ...user
                    }
                }catch(e){
                    console.log(e)
                    return res.json({
                        name:"Error",
                        status:400,
                        message:"Une erreur est surveneue"
                    })
                }
                delete user.passwordHash
            }
            //Sign and creating new access and refresh token
            const {
                access_token,
                refresh_token
            }=AuthenticatorModule.createTokens({id:user.id}, req)
    
            return res.status(200).json({
                name:"AuthenticationSucceded",
                ...result,
                access_token,
                refresh_token,
                user
            })
        }else{
            return res.status(400).json({
                status:400,
                name:"LoginFailedError",
                ...result
            })
        } 
    }else{
        return res.status(400).json({
            status:400,
            name:"LoginFailedError",
            message:"Données de connexion invalides ou manquantes."
        })
    }
          
})

authRouter.get('/logout', async (req:express.Request, res:express.Response)=>{
    await authUser(req, res, ()=>{
        req.session['access_token']=null;
        res.status(200).json({
            name:"AuthenticationSucceded",
            status:200,
            message:"Compte Déconnecté"
        })
    })
})

authRouter.post('/token',async  (req:express.Request, res:express.Response, next:express.NextFunction)=>{
    const {refresh_token}=req.body
    const reloadPayload=await AuthenticatorModule.checkToken(refresh_token, "refresh_token")
    if(reloadPayload && Boolean(reloadPayload.user?.id)){
        let {user, ip}=reloadPayload
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
        user=await prisma.user.findUnique({
            where:{
                id:user.id
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
                        command:commandSelect
                    }
                },
                commands:commandSelect,
                profileImage:true
            }
        })

        if(Boolean(user)){
            //Verify user ip
            const newIp=AuthenticatorModule.getRequestIpAdress(req)
            if(newIp!==ip){
                return res.status(400).json({
                    name:"TokenNotValidError",
                    status:400,
                    message:"Votre adresse de connexion n'a pas été reconnue. Veillez vous reconnecter."
                })
            }
            //Sign and creating new access and refresh token
            const {
                access_token,
            }=AuthenticatorModule.createTokens({id:user.id}, req)
            delete user.passwordHash
            return res.status(200).json({
                name:"TokenRefreshed",
                status:200,
                message:"Connexion rétalie avec succès",
                access_token,
                refresh_token,
                user
            }) 
        }
    }
    return res.status(400).json({
        name:"TokenNotValidError",
        status:400,
        message:"Jetons d'authentification invalide."
    })
})

//console

authRouter.post('/pwd-forgot', async  (req:express.Request, res:express.Response, next:express.NextFunction)=>{
    const {email, tel}=req.body
    if((email || tel) && (isEmail(email) || /^[0-9\s]{8,10}/.test(tel))){
        const user=email ? await AuthenticatorModule.findUserWithTel(email) : await AuthenticatorModule.findUserWithTel(tel)
        if(user){
            //Send SMS or Email to the user
        }else{
            return res.status(400).json({
                name:"EmailVerificationFailedError",
                status:400,
                message:(email ? "Email" : "Numéro de téléphone")+" invalide. Compte non retrouvé."
            })
        }
    }
    return res.status(400).json({
        name:"LoginFailedError",
        message:"Email ou Numéro de téléphone invalide ou manquant."
    })
})

authRouter.get("/user",authUser,async (req, res)=>{
    const user:any=req.user
    //@ts-ignore
    delete user.passwordHash
    return res.status(200).json({
        user
    })
})

/**
 * For simple user credentials (email , tel) verification send: <email|tel>
 * For forgot password recovery send:<email|tel> and pwdRecover:true
 * The function in the recovery mode will reture an recoveryKey that should be used to save new password after validating the code sent to the email or tel.
 * So three steps:
 * 1- Verify account existance and owner by getting otp code sent for credentials adn get back resetPassword key 
 * 2- Verify otp code
 * 3- Change password by sending new password details and reset password key
 */
authRouter.post("/otp-code", async (req, res)=>{
    const {tel, email, pwdRecover}=req.body
    let user:any=null
    try{
        if((email || tel) && (isEmail(email) || isPhoneNumber(tel, "BJ"))){
            if(pwdRecover){
                user=await prisma.user.findFirst({
                    where:{
                        ...(email ? {
                                email:{
                                    equals:email
                                }
                            }:{}),
                        ...(tel ? {
                                phone:{
                                    equals:tel
                                }
                            }:{})
                    }
                })
                if(!Boolean(user)){
                    return res.status(400).json({
                        status:400,
                        name:"VerificationError",
                        message:"Utilisateur non reconnu. Compte inexistant."
                    })
                }
            }else{
                user=await prisma.user.findFirst({
                    where:{
                        ...(email ? {
                                email:{
                                    equals:email
                                }
                            }:{}),
                        ...(tel ? {
                                phone:{
                                    equals:tel
                                }
                            }:{})
                    }
                })
                if(user){
                    return res.status(400).json({
                        status:400,
                        name:"VerificationError",
                        message:"Compte existant."
                    })
                }
            }
            if(email){
                
                const verificationMessageTemplate=await prisma.generalMeta.findFirst({
                    where:{
                        key:{
                            equals:"validation_email_template"
                        }
                    }
                })
                if(verificationMessageTemplate){
                    //get expiration duration params otp
                    const expiresDurationHour= await prisma.generalMeta.findFirst({
                        where:{
                            key:{
                                equals:"verification_code_expires_duration_hours"
                            }
                        }
                    })
                    //generate otp
                    const otp_verification_code=otp.generate(6, {upperCase:false, digits:true, alphabets:false, specialChars:false})
                    let expireAt=new Date()
                    //Expires after 2hours by default
                    expireAt.setHours(expireAt.getHours()+(Number(Boolean(expiresDurationHour?.value) ? expiresDurationHour.value: 2) ))
                    await prisma.verification.deleteMany({
                        where:{
                            email:{
                                equals:email
                            }
                        }
                    })
                    const verification=await prisma.verification.create({
                        data:{
                            context:"create_account",
                            expireAt,
                            otpCode:otp_verification_code,
                            type:"email",
                            email,
                            //if password reset  
                            ...(pwdRecover ?{pwdRecoverKey:v4().replace(/\-/g, '')}:{})
                        }
                    })
                    await EmailMailer.sendEmailWithTwillio(
                        email,
                        "Code de vérification",
                        (verificationMessageTemplate.value as string)
                        .replace(/\{\{user_email\}\}/g, verification.email)
                        .replace(/\{\{otp_verification_code\}\}/g, verification.otpCode)
                    )
                    return res.status(200).json({
                        data:{
                            ...(pwdRecover ? {pwdRecoverKey:verification.pwdRecoverKey, accountId:user.id}:{}),
                            email
                        },
                        status:200,
                        name:"VerificationCodeSent",
                        message:"Le code de vérification a été envoyé."
                    })
                }else{
                    return res.status(400).json({
                        status:400,
                        name:"VerificationError",
                        message:"Aucun méssage configuré."
                    })
                }
            }else{
                const verificationMessageTemplate=await prisma.generalMeta.findFirst({
                    where:{
                        key:{
                            equals:"validation_sms_template"
                        }
                    }
                })
                if(verificationMessageTemplate){
                    //get expiration duration params otp
                    const expiresDurationHour= await prisma.generalMeta.findFirst({
                        where:{
                            key:{
                                equals:"verification_code_expires_duration_hours"
                            }
                        }
                    })
                    //generate otp
                    const otp_verification_code=otp.generate(6, {upperCase:false, digits:true, alphabets:false, specialChars:false})
                    let expireAt=new Date()
                    //Expires after 2hours by default
                    expireAt.setHours(expireAt.getHours()+(Number(Boolean(expiresDurationHour?.value) ? expiresDurationHour.value: 2) ))
                    await prisma.verification.deleteMany({
                        where:{
                            tel:{
                                equals:tel
                            }
                        }
                    })
                    const verification=await prisma.verification.create({
                        data:{
                            context:"create_account",
                            expireAt,
                            otpCode:otp_verification_code,
                            type:"phone",
                            tel:tel.replace(/\s/, ""),
                            //if password reset  
                            ...(pwdRecover ?{pwdRecoverKey:v4().replace(/\-/g, '')}:{})
                        }
                    })
                    const t="+229"+verification.tel
                    await SmsMailer.sendSmsWithD7Network(t, (verificationMessageTemplate.value as string)
                    .replace(/\{\{user_email\}\}/g, t)
                    .replace(/\{\{otp_verification_code\}\}/g, verification.otpCode))
                    return res.status(200).json({
                        data:{
                            ...(pwdRecover ? {pwdRecoverKey:verification.pwdRecoverKey, accountId:user.id}:{}),
                            tel
                        },
                        status:200,
                        name:"VerificationCodeSent",
                        message:"Le code de vérification a été envoyé."
                    })
                }else{
                    return res.status(400).json({
                        status:400,
                        name:"VerificationError",
                        message:"Aucun méssage configuré."
                    })
                }
            }
        }else{
            return res.status(400).json({
                status:400,
                name:"VerificationError",
                message:"Données de vérification invalides ou manquantes."
            })
        }
    }catch(e){
        return res.status(400).json({
            status:400,
            name:"VerificationError",
            details:e,
            message:"Une erreur est survenue. Veillez rééssayer!"
        })
    }

})

authRouter.post('/verify-code', async(req, res)=>{
    const {tel, email, otpCode}=req.body
    try{
        if((email || tel) && (isEmail(email) || isPhoneNumber(tel, "BJ"))){
            if(email){
                const verificationObj=await prisma.verification.findFirst({
                    where:{
                        email:{
                            equals:email,
                        },
                        otpCode:{
                            equals:otpCode
                        },
                        hasBeenVerified:{
                            equals:false
                        },
                    }
                })
                if(verificationObj){
                    await prisma.verification.update({
                        where:{
                            id:verificationObj.id
                        },
                        data:{
                            hasBeenVerified:true
                        }
                    })
                    const now=new Date()
                    if(verificationObj.expireAt >= now){
                        return res.status(200).json({
                            status:200,
                            name:"VerificationCodeValidated",
                            message:"Le code de vérification a été validé."
                        })
                    }else{
                        return res.status(400).json({
                            status:400,
                            name:"VerificationError",
                            message:"Ce code de vérification a expiré."
                        })
                    }
                }else{
                    return res.status(400).json({
                        status:400,
                        name:"VerificationError",
                        message:"Le code de vérification est indisponible ou inexistant."
                    })
                }
            }else{
                //console.log(tel)
                const verificationObj=await prisma.verification.findFirst({
                    where:{
                        tel:{
                            contains:tel,
                        },
                        otpCode:{
                            equals:otpCode
                        },
                        hasBeenVerified:{
                            equals:false
                        },
                    }
                })
                if(verificationObj){
                    await prisma.verification.update({
                        where:{
                            id:verificationObj.id
                        },
                        data:{
                            hasBeenVerified:true
                        }
                    })
                    const now=new Date()
                    if(verificationObj.expireAt >= now){
                        return res.status(200).json({
                            status:200,
                            name:"VerificationCodeValidated",
                            message:"Le code de vérification a été validé."
                        })
                    }else{
                        return res.status(400).json({
                            status:400,
                            name:"VerificationError",
                            message:"Ce code de vérification a expiré."
                        })
                    }
                }else{
                    return res.status(400).json({
                        status:400,
                        name:"VerificationError",
                        message:"Le code de vérification est indisponible ou inexistant."
                    })
                }
            }
        }else{
            return res.status(400).json({
                status:400,
                name:"VerificationError",
                message:"Données de vérification invalides ou manquantes."
            })
        }
    }catch(e){
        return res.status(400).json({
            status:400,
            name:"VerificationError",
            message:"Une erreur est survenue. Veillez rééssayer!"
        })
    }
})

authRouter.post('/reset-pwd', async (req, res)=>{
    const {accountId,newPassword, pwdRecoverKey,currentPassword, access_token}=req.body
    //Edit password
    if(access_token && currentPassword && newPassword){
        const u=await decodeUser(access_token)
        if(u){
            if(compareSync(currentPassword, u.passwordHash)){
                if(currentPassword!==newPassword){
                    await prisma.user.update({
                        where:{
                            id:u.id
                        },
                        data:{
                            passwordHash:AuthenticatorModule.hashPassword(newPassword)
                        }
                    })
                    return res.status(200).json({
                        name:"ResetPasswordSuccess",
                        status:200,
                        message:"Mot de passe modifié."
                    })
                }else{
                    return res.status(400).json({
                        name:"ResetPasswordError",
                        status:400,
                        message:"Le nouveau mot de passe doit etre différent de l'ancien."
                    })
                }
            }else{
                return res.status(400).json({
                    name:"ResetPasswordError",
                    status:400,
                    message:"Ancient mot de passe non concordant."
                })
            }
        }else{
            if(access_token){
                return res.status(400).json({
                    name:"ResetPasswordError",
                    status:400,
                    message:"Données de modification invalide ou indisponible."
                })
            }
        }
    }


    //Verify if pwdRecoverKey exists
    if(pwdRecoverKey){
        const validation=await prisma.verification.findFirst({
            where:{
                pwdRecoverKey:{
                    equals:pwdRecoverKey
                }
            }
        })
        //console.log(validation)
        //Check if validation exists
        if(validation){
            if(validation.hasBeenVerified){
                //Password reset key available for 12 h after the expiration of the validation code
                const keyExpiration=validation.expireAt
                keyExpiration.setDate(keyExpiration.getDate()+12)
                const now=new Date()
                //Check if rese Password key expires
                if(keyExpiration>=now){
                    const user=await prisma.user.findUnique({
                        where:{
                            id:accountId
                        }
                    })
                    //Check if user exists
                    if(user){
                        //Check if validation if owned by user
                        if(validation.email===user.email || validation.tel===user.phone){
                            //Validate new Passsword
                            if(newPassword.length>=6){
                                await prisma.user.update({
                                    where:{
                                        id:user.id
                                    },
                                    data:{
                                        passwordHash:AuthenticatorModule.hashPassword(newPassword)
                                    }
                                })
                                return res.status(200).json({
                                    name:"ResetPasswordSuccess",
                                    status:200,
                                    message:"Mot de passe modifié."
                                })
                            }else{
                                return res.status(400).json({
                                    name:"ResetPasswordFailed",
                                    status:400,
                                    message:"Le Mot de passe doit contenir au moins 6 charactères."
                                })
                            }
                        }else{
                            return res.status(400).json({
                                name:"ResetPasswordFailed",
                                status:400,
                                message:"Vous n'etes pas authorisé à faire cette action."
                            })
                        }
                        
                    }else{
                        return res.status(400).json({
                            name:"ResetPasswordFailed",
                            status:400,
                            message:"Données ou compte utilisateur introuvable."
                        })
                    }
                }else{
                    return res.status(400).json({
                        name:"ResetPasswordFailed",
                        status:400,
                        message:"La clé d'authorization de la modification est expirée. Veillez reprendre le processus de modification de mot de passe pour rrecréer un."
                    })
                }
            }else{
                return res.status(400).json({
                    name:"ResetPasswordFailed",
                    status:400,
                    message:"Code de validation non confirmé."
                })
            }
        }else{
            return res.status(400).json({
                name:"ResetPasswordFailed",
                status:400,
                message:"Données de validation indisponibles."
            })
        }
    }else{
        return res.status(400).json({
            name:"ResetPasswordFailed",
            status:400,
            message:"Clé de renouvellement de mot de passe non fournie."
        })
    }
    //Check if account exist
    //Change password
})

export const getUser=async(userId)=>{
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
    return await prisma.user.findUnique({
        where:{
            id:userId
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
                    command:commandSelect
                }
            },
            commands:commandSelect,
            profileImage:true
        }
    })
}

export async function decodeUser(access_token, id?:string){
        const payload=await AuthenticatorModule.checkToken(access_token, "access_token")
        if(payload){
            return getUser(payload.user.id)
        }
            
}

export async function authUser(req:express.Request, res:express.Response, next:express.NextFunction){
    const access_token=AuthenticatorModule.extractToken(req)
        if(access_token){
            try{
                const user=await decodeUser(access_token)
                if(user){
                    req.user=user
                    next()
                    return;
                }
            }catch(e){
                console.log(e)
                return res.status(400).json({
                    status:400,
                    name:"TokenNotValidError",
                    message:"Une erreur est survenue lors de l'identification du compte. Veillez rééssayer."
                })
            }
        }
        return res.status(400).json({
            name:"TokenNotFound",
            status:400,
            message:"Jeton introuvable ou invalide."
        })
}

export const authOnlyAdmin=async (req, res, next)=>{
    const nextFunc=()=>{
        if(req.user?.id){
            if(AuthenticatorModule.isUser("admin", req.user)){
                next()
            }else{
                return res.status(400).json({
                    name:"AuthorizationDenied",
                    status:400,
                    message:"Action non autorisée."
                })
            }
        }else{
            return res.status(400).json({
                name:"AuthorizationDenied",
                status:400,
                message:"Données incomplètes ou manquantes. Action non autorisée."
            })
        }
    }
    if(req.user){
        nextFunc()
    }else{
        await authUser(req, res, nextFunc)
    }
}

export const authOnlyCustomer=async (req, res, next)=>{
    const nextFunc=()=>{
        if(req.user){
            if(AuthenticatorModule.isUser("customer", req.user)){
                next()
            }else{
                return res.status(400).json({
                    name:"AuthorizationDenied",
                    status:400,
                    message:"Action non autorisée."
                })
            }
        }else{
            return res.status(400).json({
                name:"AuthorizationDenied",
                status:400,
                message:"Données incomplètes ou manquantes. Action non autorisée."
            })
        }
    }
    if(req.user){
        nextFunc()
    }else{
        await authUser(req, res, nextFunc)
    }
}

export {authRouter}
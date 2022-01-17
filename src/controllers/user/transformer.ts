import { prisma } from "../../database";
import { CreateManyNestedField, CreateOneNestedField, UpdateOneNestedField } from "../fun";
import { genSaltSync, hashSync } from "bcrypt"
import { AuthenticatorModule } from "../../services/authenticator.module";
import {v4} from "uuid"
import { NOTIFICATION_STATUS, NOTIFICATION_THEME } from "../../config/admin.config";


export const inputDto=async (data:any, context:string="create")=>{
    console.log(data)
    const {password,profileImageId, ...d}=data
    switch(context){
        case "create":
            if(await prisma.user.findFirst({
                where:{
                    OR:[
                        {
                            phone:{
                                equals:data.phone
                            }
                        },
                        {
                            email:{
                                equals:data.email
                            }
                        }
                    ]
                }
            })){
                return{
                    _status:400,
                    message:"Compte existant."
                }
            }
            console.log({
                ...d,
                ...(Boolean(profileImageId) ? {profileImage:CreateOneNestedField({id:profileImageId}, 'connect')}:{}),
                passwordHash:AuthenticatorModule.hashPassword(password),
            })
            return {
                ...d,
                ...(Boolean(profileImageId) ? {profileImage:CreateOneNestedField({id:profileImageId}, 'connect')}:{}),
                ...(Boolean(data?.profileImage?.id) ? {profileImage:CreateOneNestedField(data?.profileImage, 'connect')}:{}),
                passwordHash:AuthenticatorModule.hashPassword(password),
                notifications:CreateManyNestedField([{
                    id:v4(),
                    title:"Bienvenue sur Tokpa",
                    context:NOTIFICATION_STATUS.newAccount,
                    theme:NOTIFICATION_THEME.info,
                    content:"Soyez le bienvenue sur tokpa le premier marché en ligne et le plus grand de l'Afrique de l'ouest. Nous vous souhaitons une bonne expérience avec nos services."
                }], "create")
            }
        case "update":
            return{
                ...d,
                ...(Boolean(profileImageId) ? {profileImage:UpdateOneNestedField({id:profileImageId}, 'connect')}:{}),
                ...(Boolean(data?.profileImage?.id) ? {profileImage:CreateOneNestedField(data?.profileImage, 'connect')}:{}),
                ...(password ? {passwordHash:AuthenticatorModule.hashPassword(password)}:{})
            }
        default:
            return data;
    }
}

export const outputDto=(data:any, context:string="create")=>{
    switch(context){
        case "create":
            return data
        case "selectOne":
            const {passwordHash, ...d}=data
            return d
        default:
            return data;
    }
}
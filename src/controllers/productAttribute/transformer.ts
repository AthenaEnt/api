import { prisma } from "../../database";
import { CreateManyNestedField, CreateOneNestedField, UpdateManyNestedField, UpdateOneNestedField } from "../fun";
import {v4} from "uuid"

export const inputDto=async (datas:any, context:string="create")=>{
    const {categoryId,...data}=datas
    switch(context){
        case "create":
            
            return {
                ...data,
                category:CreateOneNestedField({id:categoryId}, "connect"),
                metas:CreateManyNestedField(data.metas.map((o:any)=>({...o, id:v4()})), "create")
            }
        case "update":
            const oldMetas=(await prisma.productAttribute.findUnique({
                where:{
                    id:data.id
                },
                select:{
                    metas:true
                }
            }))?.metas
            return {
                ...data,
                ...(categoryId ? {category:UpdateOneNestedField({id:categoryId}, "connect")} :{}),
                metas:UpdateManyNestedField(data.metas, [
                    {
                        action:"create",
                        filter:(data:any)=>data.filter((m:any)=>!Boolean(m.id))
                    },
                    {
                        action:"delete",
                        filter:(data:any)=>oldMetas ? oldMetas.filter((me)=>!Boolean(data.find((d:any)=>d.id===me.id))) : []
                    },
                    {
                        action:"update",
                        filter:(data:any)=>oldMetas ? data.filter((m:any)=>m.id && Boolean(oldMetas.find((me)=>me.id===m.id))) : []
                    }
                ])
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
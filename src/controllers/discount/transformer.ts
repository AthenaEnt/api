import { prisma } from "../../database";

export const inputDto=async (data:any, context:string="create")=>{
    const validate=(data)=>{
        if(data.discountNature==="PRICE" && !(data.commandAmountMin || data.commandAmountMax)){
            return {
                _status:400,
                message:"Le montant minimale et maximale de la commande doivent etre définie. "
            }
        }
        if(data.discountNature==="VOLUMNE" && !(data.inCartProductMin || data.inCartProductMax)){
            return {
                _status:400,
                message:"La quantité minimale et maximale de la commande doit etre définie. "
            }
        }
        if((data.commandAmountMin && data.commandAmountMax) && !(data.commandAmountMin < data.commandAmountMax)){
            return {
                _status:400,
                message:"Le prix minimale de la commande doit etre inférieur au prix maximale. "
            }
        }
        if(data.inCartProductMin && data.inCartProductMax && !(data.inCartProductMin < data.inCartProductMax)){
            return {
                _status:400,
                message:"la quantité minimale de la commande doit etre inférieure à la quantité maximale "
            }
        }
        return true
    }
    let r:any
    switch(context){
        case "create":
            r=validate(data)
            if(r===true){
                return {
                    ...data,
                    startAt:new Date(data.startAt),
                    endAt:new Date(data.endAt)
                }
            }
            return r;
            
        case"update":
            const oldData=await prisma.discount.findUnique({
                where:{
                    id:data.id
                }
            })
            data={
                ...oldData,
                ...data,
                ...(data.startAt ?{startAt:new Date(data.startAt)} :{}),
                ...(data.endAt ?{endAt:new Date(data.endAt)} :{}),
            }
            r=validate(data)
            if(r===true){
                return {
                    ...data,
                    
                }
            }
            return r;
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
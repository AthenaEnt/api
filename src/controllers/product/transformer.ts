import { Prisma } from "../../database/generated/client";;
import { prisma } from "../../database";
import { CreateManyNestedField, CreateOneNestedField, UpdateManyNestedField, UpdateOneNestedField } from "../fun";
import {v4} from "uuid"

export const inputDto=async (datas:any, context:string="create")=>{
    const pricer=async (data:any)=>{
        const pricingRule=await prisma.priceRule.findMany()
        const calcPrice=(price)=>{
            let priceRule=pricingRule.find(p=>{
                if(price>=p.minPrice ){
                    if(p.maxPrice){
                        if(price<=p.maxPrice){
                            return true
                        }else{
                            return false
                        }
                    }else{
                        return true
                    }
                }else{
                    return false
                }
            })
            if(priceRule){
                return {priceRule, unitPrice:Math.round(price*(1+(priceRule.amountPercent/100)))}
                /*if(data.onSalePrice){
                    data.onSalePrice=Math.round(data.onSalePrice*(1+(priceRule.amountPercent/100)))
                }*/
            }else{
                throw new Error("Aucun critère de calcul du prix réel des produit n'est défini pour certaines unités.")
            }
        }
        data.commandUnitProducts=data.commandUnitProducts.map((cu:any)=>({
            ...cu,
            ...(cu.unitPrice ? calcPrice(cu.unitPrice): {})
        }))
        return data
        
    }
    try{
        let {variations=[], variationMetas,commandUnitProducts, ...data}=datas ??{}
        const getCommon=async(objDatas, create=true):Promise<Prisma.ProductCreateInput>=>{
            if(["simple", "variant"].includes(objDatas.type.toLowerCase())){
                objDatas=await pricer({commandUnitProducts, ...objDatas})
            }
            let {commandUnitProducts:CommandUnitProducts, ...usedDatas}=objDatas
            return {
                ...usedDatas,
                ...(Boolean(create && usedDatas.categories?.length) ? { categories:CreateManyNestedField(usedDatas.categories, "connect")} : (usedDatas.categories ? { categories:UpdateManyNestedField(usedDatas.categories, "connect")}:{})),
                ...(Boolean(create && usedDatas.medias?.length) ? { medias:CreateManyNestedField(usedDatas.medias, "connect")} : (usedDatas.medias ? {medias:UpdateManyNestedField(usedDatas.medias, "connect")} :{})),
                ...(Boolean(usedDatas?.shippingZones) && usedDatas.shippingZones.length ? {shippingZones:CreateManyNestedField(usedDatas.shippingZones, "connect")}:{}),
                ...(Boolean(usedDatas?.tags) && usedDatas.tags.length ? {tags:CreateManyNestedField(usedDatas.tags, "connect")}:{}),
                ...(Boolean(usedDatas?.marque?.id) ? {marque:CreateOneNestedField(usedDatas.marque, "connect")}:{}),
                ...(Boolean(CommandUnitProducts?.length) ? (create ? {
                    commandUnitProducts:CreateManyNestedField(CommandUnitProducts.map((cu:any)=>({
                        id:v4(),
                        ...cu,
                        priceRule:CreateOneNestedField({id:cu.priceRule.id}, "connect"),
                        commandUnit:CreateOneNestedField({id:cu.commandUnit.id}, "connect")
                    })), "create")
                } :{
                    commandUnitProducts:UpdateManyNestedField(CommandUnitProducts.map(({priceRule, commandUnit, ...cu}:any)=>({
                        ...cu,
                        ...(priceRule ? {priceRule:UpdateOneNestedField({id:priceRule.id}, "connect")}:{}),
                        ...(commandUnit ? {commandUnit:UpdateOneNestedField({id:commandUnit.id}, "connect")}:{}),
                    })), "create")
                }):{})
            }
        }
        
        if(context.includes("create") || context.includes('update')){
            if( !Boolean(data.categories?.length)){
                return{
                    _status:400,
                    message:"Aucune catégorie définie."
                }
            }

            if( data.type==="SIMPLE" && !Boolean(data.medias?.length)){
                return{
                    _status:400,
                    message:"Aucune photo définie."
                }
            }else if(data.type==="VARIABLE"){
                if(variations.find(n=>{
                    return !Boolean(n.medias?.length)
                })){
                    return{
                        _status:400,
                        message:"Certaines variations n'ont pas d'images."
                    }
                }
            }

            //const d=await getCommon(data)
            /*if(d.onSale){
                if(!d.onSalePrice){
                    return {
                        _status:400,
                        message:"Le prix promotionnel du produit doit etre défini."
                    }
                }else if(!(d.onSalePrice < d.regularPrice)){
                    return {
                        _status:400,
                        message:"Le prix promotionel du produit doit etre inférieur à son prix régulier."
                    }
                }
                if(!data.onSaleStartAt || !data.onSaleEndAt){
                    return{
                        _status:400,
                        message:"La date de début et de fin de la promotion doivent etre définie."
                    }
                }else if(!(data.onSaleStartAt < data.onSaleEndAt)){
                    return{
                        _status:400,
                        message:"La date de début de promotion doit etre inférieure à la date de fin de promotion."
                    }
                }
            }*/
        }
        
        const createAndUpdateVariable=async ()=>{
            let commons:any;
            commons=await getCommon(data)
            let p:any,pVariations:any=[]
            const productPersistData={
                
                ...commons, 
                id:v4(),
                type:"VARIABLE"
            }
            if(data.id){
                p=await  prisma.product.update({
                    data:productPersistData,
                    where:{
                        id:data.id
                    }
                })
            }else{
                p=await  prisma.product.create({
                    data:productPersistData
                })
            }
            //console.log(variations)
            for(let i = 0; i<variations.length; i++){
                const {variationMetas=[],medias=[], ...v}=variations[i]
                const { commandUnitProducts}=await getCommon(variations[i])
                const validateMetas=async (variationMetas)=>{
                    const attrs=[]
                    for(let i = 0;i < variationMetas.length; i++){
                        const varMetasObj=await prisma.productAttributeMeta.findUnique({
                            where:{
                                id:variationMetas[i].id
                            },
                            include:{
                                attribute:true
                            }
                        })
                        if(attrs.includes(varMetasObj.attribute.id)){
                            throw new Error('Product variant cannot have same attribute multiple time.')
                        }else{
                            attrs.push(varMetasObj.attribute.id)
                        }
                        
                    }
                }
                await validateMetas(variationMetas);
                const persisData={
                    ...v,
                    id:v.id ?? v4(),
                    type:"VARIANT",
                    commandUnitProducts,
                    variantParent:{
                        connect:{
                            id:p.id
                        }
                    },
                    medias:CreateManyNestedField(medias, "connect"),
                    variationMetas:CreateManyNestedField(variationMetas, "connect")
                }
                if(v.id){
                    pVariations.push(await prisma.product.update({
                        data:persisData,
                        where:{
                            id:Boolean(v.id) ? v.id: v4()
                        }
                    }))
                }else{
                    pVariations.push(await prisma.product.create({
                        data:persisData 
                    }))
                }
                
            }
            if(data.id ){
                variations=variations ??[]
                const product =await prisma.product.findUnique({
                    where:{
                        id:data.id
                    },
                    select:{
                        variations:true
                    }
                }) 
                const toDeleteProducts=product?.variations.filter((vari)=>!Boolean(variations.find((v:any)=>v.id===vari.id)))
                if(toDeleteProducts.length){
                    await prisma.product.deleteMany({
                        where:{
                            id:{
                                in:toDeleteProducts.map((p)=>p.id)
                            }
                        }
                    })
                }
            }
            return {
                _status:200,
                ...p,
                variations:pVariations
            }
            
        }
        //console.log(context)
        switch(context){
            case "create::simple":{

                /*, */
                let content=await getCommon(data)
                return {...content, type:"SIMPLE"}
            }
            case "update::simple":{
                let content=await getCommon(data, false)
                return {...content, type:"SIMPLE"}
            }
            case "create::variable":{
                return await createAndUpdateVariable()
            }
                
            default:
                return data;
        }
    }catch(e){
        console.log(e)
        return{
            _status:400,
            message:"Une erreur est survenue",
            details:e.message

        }
    }
}

export const outputDto=(data:any, context:string="create", isAdmin)=>{
    const formatProduct=(data)=>{
        const filterProduct=(p:any)=>p.isPublished
        if(!isAdmin){
            if(data instanceof Array){
                return data.filter((d:any)=>filterProduct(d))
            }else{
                return filterProduct(data)
            }
        }
        return data
        
    }
    switch(context){
        case "create":
            return formatProduct(data)
        default:
            return formatProduct(data);
    }
}
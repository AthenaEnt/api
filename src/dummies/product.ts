import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
import { uploadImages } from "./media"
import {v4} from "uuid"
import slugify from "slugify"
//inStock
const mocks=[
    {
        name:"",
        slug:"",
        description:"",
        shortDescription:"",
        type:"VARIANT",
        isPublished:true,
        stockSize:0,
        productWeight:0,
        commandUnitProducts:"1,2,3",
        sku:faker.datatype.uuid(),
        showProduct:true,
        hasUserDeleted:false,
        marque:"",
        categories:"cat1,cat2",
        medias:"ok.png, ok1.png",
        tags:"1,3",
        variationMetas:"1, 2",
        variations:"1,2"
    }
]
const  commandUnitProducts=[
    {
        commandUnit:"title ",
        unitPrice:0
    }
]

const variationMetas=[
    {
        "attributeName":"",
        "metaValue":""
    }
]

export const split=(data)=>{
    return data.replace(/\s/g, "").split(',')
}

const getCommmandUnits=async (product, allCommandUnitProducts)=>{
    if((!Boolean(product.type) || ["simple", "variant"].includes(product.type.toLowerCase()))  && commandUnitProducts ){
        const commandUnits=[]
        console.log(product.commandUnitProducts, product, "line 51")

        let commandUnitProducts=typeof product.commandUnitProducts==="string" ? split(product.commandUnitProducts).map((index)=>Number(index)):[product.commandUnitProducts]
        for(let j in commandUnitProducts){

            commandUnits.push({
                ...allCommandUnitProducts[Number(commandUnitProducts[j])-2],
                commandUnit:await prisma.commandUnit.findFirst({
                    where:{
                        OR:[
                            {
                                shortCode:{
                                    equals:allCommandUnitProducts[Number(commandUnitProducts[j])-2].commandUnit,
                                    //mode:"insensitive"
                                }
                            },
                            {
                                title:{
                                    equals:allCommandUnitProducts[Number(commandUnitProducts[j])-2].commandUnit,
                                    //mode:"insensitive"
                                }
                            }
                        ]
                    }
                })
            })
        }
        return commandUnits;
    }
}

const getMedias=async (medias:any)=>{
    return (await prisma.media.findMany({
        where:{
            filename:{
                in:split(medias)
            }
        }
    })).map((m)=>({id:m.id}))
}

export const persistProducts=async (accessToken, mocks, allCommandUnitProducts, allVariationMetas)=>{
    console.log(allCommandUnitProducts)
    const products=mocks.filter((p:any)=>{
        console.log(p)
        return ['simple', 'variable'].includes(p.type.toLowerCase())
    })
    for(let i =0; i<products.length; i++){
        let {variations, variationMetas, commandUnitProducts, categories,marque, medias, tags:productTags, ...prod}=products[i]

        if(prod.type.toLowerCase()==="simple"){
            prod.commandUnitProducts=await getCommmandUnits(products[i], allCommandUnitProducts)
        }

        //Categories edited
        categories=split(categories)
        if(Boolean(categories?.length)){
            for(let j in categories){
                prod.categories=await Promise.all(categories.map(async()=>{
                    return await prisma.category.findFirst({
                        where:{
                            title:{
                                equals:categories[j],
                                //mode:"insensitive"
                            }
                        },
                        select:{
                            id:true
                        }
                    })
                }))
                console.log(prod.categories)
            }
        }
        
        if(prod.type.toLowerCase()==="simple"){
           prod.medias=await  getMedias(medias)
        }

        if(Boolean(marque)){
            prod.marque=(await prisma.marque.findFirst({
                where:{
                    name:{
                        equals:marque,
                        //mode:"insensitive"
                    }
                }
            }))
            prod.marque={id:prod.marque.id}
        }
        
        //Product tags edited
        productTags=productTags && productTags.length ? split(productTags) : []
        if(productTags?.length){
            const tags=[]
            for(let j in productTags){
                tags.push(await prisma.tag.create({
                    data:{
                        id:v4(),
                        name:productTags[j],
                        slug:slugify(productTags[j])
                    }
                }))
            }
            prod.tags=tags.map(t=>({id:t.id}))
        }

        if(prod.type.toLowerCase()==="variable"){
            const vars=[]
            //variations edited 
            variations=split(variations)
            for( let j in variations){
                let metas:any=[]
                let {variationMetas, commandUnitProducts, categories,marque, medias, tags:productTags, ...variation}=mocks[Number(variations[Number(j)]-2)]
                //variation metas edited
                console.log(variationMetas,mocks[Number(variations[Number(j)]-2)], "line 166")
                variationMetas=typeof variationMetas==="number" ? [variationMetas-2]:split(variationMetas).map((m)=>Number(m)  - 2)
                console.log(variationMetas)
                variationMetas=await Promise.all(variationMetas.map((vm:any)=>{
                    console.log(allVariationMetas[vm])
                    return allVariationMetas[vm]
                }).map(async (vm)=>{
                    let m:any= (await prisma.productAttributeMeta.findMany({
                        where:{
                            attribute:{
                                name:{
                                    equals:vm.attributeName,
                                    //mode:"insensitive"
                                }
                            }
                        }
                    }))
                    console.log(m)
                    m=m.find((m:any)=>JSON.stringify(m.value).includes(vm.value))
                    return m
                }))
                const cmd=await getCommmandUnits(mocks[Number(variations[Number(j)]-2)], allCommandUnitProducts)
                console.log(mocks[Number(variations[Number(j)]-2)])
                vars.push({
                    ...variation,
                    showProduct:true,
                    hasUserDeleted:false,
                    isPublished:true,
                    sku:faker.datatype.uuid(),
                    medias:await  getMedias(medias),
                    variationMetas,
                    commandUnitProducts:cmd
                })
                console.log(cmd)
                
            }  
            prod.variations=vars
        }
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/products', {
                data:{
                    showProduct:true,
                    hasUserDeleted:false,
                    isPublished:true,
                    sku:faker.datatype.uuid(),
                    ...prod
                }
            }, {
                maxBodyLength:Infinity,
                maxContentLength:Infinity
            })
        }catch(e){
            console.log(JSON.stringify(e.response.data))
        }
       
        
        
    }    
}

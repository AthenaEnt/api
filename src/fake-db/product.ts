import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
const mocks=[
    
]


export const persistProducts=async (accessToken)=>{
    const medias=await prisma.media.findMany()
    const attributes=await prisma.productAttribute.findMany({
        include:{
            metas:true
        }
    })
    const marque=await prisma.marque.findMany()
        const categories=await prisma.category.findMany()
        const shippingZones= await prisma.shippingZone.findMany()
        const commandUnits=await prisma.commandUnit.findMany()
        const tags=await prisma.tag.findMany()
    for(let i =0; i<10; i++){
        const toInt=(v)=>Number(v.toString().slice(0, v.toString().indexOf(".")))

        const name=faker.commerce.productName()
        const type:string='VARIABLE'//faker.random.arrayElement(['VARIABLE'])
       
        const product={
            name,
            slug:faker.helpers.slugify(name),
            description:faker.lorem.paragraphs(),
            "shortDescription":faker.commerce.productDescription(),
            type,
            isPublished:faker.datatype.boolean(),
            marque:{
                id:marque[Math.abs(Math.round(Math.random()*marque.length)-1)].id
            },
            showProduct:true,
            hasUserDeleted:false,
            ...(type!=="SIMPLE" ? {
                variations: Array.from(new Array(5)).map(()=>{
                    const metas=faker.random.arrayElements(attributes, 5).map((a)=>faker.random.arrayElement(a.metas))
                    const name=faker.commerce.productName()
                    const type="VARIANT"
                    const regularPrices=toInt(parseInt(Math.round(Math.random()*100000).toString()))
                    const stockSizes=toInt(parseInt(Math.round(Math.random()*10000).toString()))
                    
                    return{
                        name,
                        slug:faker.helpers.slugify(name),
                        description:faker.lorem.paragraphs(),
                        "shortDescription":faker.commerce.productDescription(),
                        type:"VARIANT",
                        isPublished:faker.datatype.boolean(),
                        sku:faker.datatype.uuid(),
                        showProduct:true,
                        hasUserDeleted:false,
                        variationMetas:metas.map((c)=>({id:c.id})),
                        commandUnitProducts:faker.random.arrayElements(commandUnits, faker.datatype.number({min:1, max:4})).map((c)=>{
                            return{
                                commandUnit:{
                                    id:c.id
                                },
                                unitPrice:faker.datatype.number({min:100, max:10000, precision:100})
                            }
                        }),
                        medias:faker.random.arrayElements(medias.map((c)=>({id:c.id}), 5))
                    }
                }),
            }:{}),
            categories:faker.random.arrayElements(categories.map((c)=>({id:c.id})), 5),
            shippingZones:faker.random.arrayElements(shippingZones.map((c)=>({id:c.id})), 5),
            tags:faker.random.arrayElements(tags.map((c)=>({id:c.id})), 5),
            ...(type==="SIMPLE" ? {
                medias:faker.random.arrayElements(medias.map((c)=>({id:c.id})), 5),
                sku:faker.datatype.uuid(),
                commandUnitProducts:faker.random.arrayElements(commandUnits, faker.datatype.number({min:1, max:4})).map((c)=>({
                    commandUnit:{
                        id:c.id
                    },
                    unitPrice:faker.datatype.number({min:100, max:10000, precision:100})
                })),
            } :{})
        }
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/products', {
                data:{
                    ...product
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

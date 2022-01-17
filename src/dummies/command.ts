import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
const mocks=[
    {
        minPrice:1000,
        maxPrice:2000,
        amountPercent:8
    },
    {
        minPrice:2000,
        maxPrice:3000,
        amountPercent:10
    },
]


export const persistCommands=async (accessToken)=>{
    let users=await prisma.user.findMany({
         where:{
             shippingAdress:{
                 some:{
                     NOT:[
                         {
                             id:{
                                 equals:undefined
                             }
                         }
                     ]
                 }
             }
         },
         include:{
             shippingAdress:true
         }
     })
    const commandUnits=await prisma.commandUnitProduct.findMany()
    const products=await prisma.product.findMany()
    const user=faker.random.arrayElement(users)
    const discount = await prisma.discount.findMany()
    for(let i =0; i<10; i++){
        
        
        

        const command={
            delivered:false,
            hasUserCanceled:false,
            orderedBy:{
                id:user.id
            },
            shippingAdress:{
                id:faker.random.arrayElement(user.shippingAdress).id
            },
            commandProducts:faker.random.arrayElements(products, Math.round(faker.datatype.number({
                min:1,
                max:5
            }))).map(p=>({
                product:{id:p.id}, 
                commandUnitProduct:{
                    id:faker.random.arrayElement(commandUnits).id
                },
                quantite:Math.round(faker.datatype.number({min:1, max:100}))})),
            ...(faker.datatype.boolean() ? {appliedDiscount:{
                id:faker.random.arrayElement(discount).id
            }} : {})
        }
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/commands', {
                data:command
            })
        }catch(e){
            console.log(JSON.stringify(e.response.data))
        }
        
    }
}
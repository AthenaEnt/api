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
             email:{
                 equals:"agblap1@gmail.com"
             }
            },
            include:{
                shippingAdress:true
            }
    })
    console.log(users)
    const commandUnits=await prisma.commandUnitProduct.findMany()
    const products=await prisma.product.findMany({
        where:{
            type:{
                in:['SIMPLE', "VARIABLE"],
                //mode:"insensitive"
            }
        }
    })
    const user=faker.random.arrayElement(users)
    const discount = await prisma.discount.findMany()
    for(let i =0; i<10; i++){
        
        console.log()
    
        const command={
            delivered:false,
            hasUserCanceled:false,
            orderedBy:{
                id:user.id
            },
            shippingAdress:{
                id:user.shippingAdress[0].id
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
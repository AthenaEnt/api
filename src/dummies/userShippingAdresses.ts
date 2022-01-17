import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
const mocks=[
    {
        quatier:"Ajiro",
        fullName:"Crépin",
        phone:"67008302",
        alternatePhone:"67008302",
        adressType:"office"
    },
    {
        quatier:"Agla",
        fullName:"Crépin",
        phone:"67008302",
        alternatePhone:"67008302",
        adressType:"home"
    }
]


export const persistUserShippingAdresses=async (accessToken)=>{
    const user=await prisma.user.findFirst({
        where:{
            email:{
                contains:'agblap1@gmail.com'
            }
        }
    })
    const shippingZones=await prisma.shippingZone.findMany()
    for(let i=0; i<mocks.length; i++){
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/userShippingAdresses', {
                data:{
                    ...mocks[i],
                    forUser:{
                        id:user.id
                    },
                    shippingZone:{
                        id:faker.random.arrayElement(shippingZones).id
                    }
                }
            })
        }catch(e){
            console.log(JSON.stringify(e))
        }
    }
}
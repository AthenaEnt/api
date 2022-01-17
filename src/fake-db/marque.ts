import axios from "axios"
import { prisma } from "../database"
import faker from "faker"
const mocks=[
    {
        name:"Zinco"
    },
    {
        name:"Amia"
    },
    {
        name:"Rémina"
    }
]


export const persistMarques=async (accessToken)=>{
    const medias=await prisma.media.findMany()
    const categories=await prisma.category.findMany()
    for(let i =0; i<mocks.length; i++){
        
        try{
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            await axios.post('http://localhost:'+process.env.PORT+'/api/marques', {
                data:{
                    imageId:faker.random.arrayElement(medias).id,
                categoryId:faker.random.arrayElement(categories).id,
                ...mocks[i]
                }
            })
        }catch(e){
            console.log(JSON.stringify(e.response))
        }
    }
}